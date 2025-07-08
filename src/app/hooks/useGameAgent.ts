import { useCallback, useEffect, useState } from "react";
import { useGameSession } from "../providers/GameSessionProvider";
import { useTranscript } from "../contexts/TranscriptContext";

export interface GameScenario {
  id: string;
  problem: string;
  childQuote: string;
  context: string;
  goodAdviceKeywords: string[];
  badAdviceKeywords: string[];
}

export interface GameFinishResult {
  success: boolean;
  score: number;
  message: string;
}

export interface UseGameAgentOptions {
  onGameStart?: (scenario: GameScenario) => void;
  onGameFinish?: (result: GameFinishResult) => void;
}

export function useGameAgent(options: UseGameAgentOptions = {}) {
  const { onGameStart, onGameFinish } = options;
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
        if (item.title.includes("start_child_advice_game") && item.data) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_child_advice_game") &&
          item.data
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse game finish result:", e);
          }
        }
      }
    }
  }, [transcriptItems, onGameStart, onGameFinish, processedItemIds]);

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

    // Send a message to trigger the game host agent to start the game
    sendUserText(
      "Hello! I'm ready to play Advise the Child. Please start the game!"
    );
  }, [sendUserText, isWebRTCReady]);

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
