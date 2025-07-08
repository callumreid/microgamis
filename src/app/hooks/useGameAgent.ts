import { useCallback, useEffect, useState } from "react";
import { useGameSession } from "../providers/GameSessionProvider";
import { useTranscript } from "../contexts/TranscriptContext";

export interface GameScenario {
  id: string;
  problem: string;
  childQuote?: string;
  policeQuote?: string;
  alienQuote?: string;
  context: string;
  goodAdviceKeywords?: string[];
  badAdviceKeywords?: string[];
  goodStallKeywords?: string[];
  badStallKeywords?: string[];
  goodConvinceKeywords?: string[];
  badConvinceKeywords?: string[];
}

export interface GameFinishResult {
  success: boolean;
  score: number;
  message: string;
}

export interface UseGameAgentOptions {
  onGameStart?: (scenario: GameScenario) => void;
  onGameFinish?: (result: GameFinishResult) => void;
  gameType?: "advise-the-child" | "stall-the-police" | "convince-the-aliens" | "evaluate-yourself" | "point-the-task";
}

export function useGameAgent(options: UseGameAgentOptions = {}) {
  const { onGameStart, onGameFinish, gameType = "point-the-task" } = options;
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
        // Handle police stall game
        else if (item.title.includes("start_police_stall_game") && item.data && gameType === "stall-the-police") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse police stall game start scenario:", e);
          }
        } else if (item.title.includes("finish_police_stall_game") && gameType === "stall-the-police") {
          try {
            console.log("🔍 Found finish_police_stall_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse police stall game finish result:", e);
          }
        }
        // Handle alien convince game
        else if (item.title.includes("start_alien_convince_game") && item.data && gameType === "convince-the-aliens") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse alien convince game start scenario:", e);
          }
        } else if (item.title.includes("finish_alien_convince_game") && gameType === "convince-the-aliens") {
          try {
            console.log("🔍 Found finish_alien_convince_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse alien convince game finish result:", e);
          }
        }
        // Handle self-evaluation game
        else if (item.title.includes("start_self_evaluation_game") && item.data && gameType === "evaluate-yourself") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse self-evaluation game start scenario:", e);
          }
        } else if (item.title.includes("finish_self_evaluation_game") && gameType === "evaluate-yourself") {
          try {
            console.log("🔍 Found finish_self_evaluation_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse self-evaluation game finish result:", e);
          }
        }
        // Handle point-the-task game
        else if (item.title.includes("start_point_task_game") && item.data && gameType === "point-the-task") {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse point-the-task game start scenario:", e);
          }
        } else if (item.title.includes("finish_point_task_game") && gameType === "point-the-task") {
          try {
            console.log("🔍 Found finish_point_task_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse point-the-task game finish result:", e);
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
      "stall-the-police": "Hello! I'm ready to play Stall the Police. Please start the game!",
      "convince-the-aliens": "Hello! I'm ready to play Convince the Aliens. Please start the game!",
      "evaluate-yourself": "Hello! I'm ready to play Evaluate Yourself. Please start the game!",
      "point-the-task": "Hello! I'm ready to play Point the Engineering Task. Please start the game!"
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
