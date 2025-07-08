import { useCallback, useEffect, useState } from "react";
import { useGameSession } from "../providers/GameSessionProvider";
import { useTranscript } from "../contexts/TranscriptContext";

export interface GameScenario {
  id: string;
  problem: string;
  childQuote?: string;
  policeQuote?: string;
  context: string;
  goodAdviceKeywords?: string[];
  badAdviceKeywords?: string[];
  goodStallKeywords?: string[];
  badStallKeywords?: string[];
}

export interface GameFinishResult {
  success: boolean;
  score: number;
  message: string;
}

export interface UseGameAgentOptions {
  onGameStart?: (scenario: GameScenario) => void;
  onGameFinish?: (result: GameFinishResult) => void;
  gameType?: "advise-the-child" | "puh-lease-officer";
}

export function useGameAgent(options: UseGameAgentOptions = {}) {
  const { onGameStart, onGameFinish, gameType = "advise-the-child" } = options;
  const { sendUserText, isWebRTCReady } = useGameSession();
  const { transcriptItems } = useTranscript();
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(
    null
  );
  const [processedItemIds, setProcessedItemIds] = useState<Set<string>>(
    new Set()
  );

  // Listen for game tool calls in the transcript items
  useEffect(() => {
    if (!transcriptItems || transcriptItems.length === 0) return;

    // Look for recent breadcrumb items with tool call results
    const recentBreadcrumbs = transcriptItems
      .filter(
        (item) =>
          item.type === "BREADCRUMB" && !processedItemIds.has(item.itemId)
      )
      .slice(-10); // Check last 10 breadcrumbs

    for (const item of recentBreadcrumbs) {
      if (item.title?.includes("function call result:")) {
        // Handle child advice game
        if (item.title.includes("start_child_advice_game") && item.data && gameType === "advise-the-child") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse child advice game start scenario:", e);
          }
        } else if (item.title.includes("finish_child_advice_game") && gameType === "advise-the-child") {
          try {
            console.log("🔍 Found finish_child_advice_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse child advice game finish result:", e);
          }
        }
        // Handle police game
        else if (item.title.includes("start_puh_lease_officer_game") && item.data && gameType === "puh-lease-officer") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse police game start scenario:", e);
          }
        } else if (item.title.includes("finish_puh_lease_officer_game") && gameType === "puh-lease-officer") {
          try {
            console.log("🔍 Found finish_puh_lease_officer_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse police game finish result:", e);
          }
        }
      }
    }
  }, [transcriptItems, onGameStart, onGameFinish, processedItemIds, gameType]);

  const startGame = useCallback(() => {
    if (!sendUserText) {
      console.error(
        "sendUserText not available - is realtime session connected?"
      );
      return;
    }

    if (!isWebRTCReady) {
      console.log("WebRTC not ready yet, waiting...");
      return;
    }

    // Send a message to trigger the game host agent to start the appropriate game
    const gameMessages = {
      "advise-the-child": "Hello! I'm ready to play Advise the Child. Please start the game!",
      "puh-lease-officer": "Hello! I'm ready to play Puh Lease Officer. Please start the game!"
    };
    
    sendUserText(gameMessages[gameType]);
  }, [sendUserText, isWebRTCReady, gameType]);

  const sendPlayerText = useCallback(
    (text: string) => {
      if (!sendUserText) {
        console.error(
          "sendUserText not available - is realtime session connected?"
        );
        return;
      }

      if (!isWebRTCReady) {
        console.error("WebRTC not ready - cannot send player text");
        return;
      }

      sendUserText(text);
    },
    [sendUserText, isWebRTCReady]
  );

  return {
    startGame,
    sendPlayerText,
    isGameActive,
    currentScenario,
  };
}
