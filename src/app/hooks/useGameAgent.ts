import { useCallback, useEffect, useState } from "react";
import { useGameSession } from "../providers/GameSessionProvider";
import { useTranscript } from "../contexts/TranscriptContext";

export interface GameScenario {
  id: string;
  problem: string;
  childQuote?: string;
  policeQuote?: string;
  alienQuote?: string;
  customerQuote?: string;
  bullyQuote?: string;
  daughterQuote?: string;
  turkeyQuote?: string;
  bossQuote?: string;
  vcQuote?: string;
  strangerQuote?: string;
  animalName?: string;
  context: string;
  goodAdviceKeywords?: string[];
  badAdviceKeywords?: string[];
  goodStallKeywords?: string[];
  badStallKeywords?: string[];
  goodConvinceKeywords?: string[];
  badConvinceKeywords?: string[];
  goodSaleKeywords?: string[];
  badSaleKeywords?: string[];
  goodComebackKeywords?: string[];
  badComebackKeywords?: string[];
  goodDeathKeywords?: string[];
  badDeathKeywords?: string[];
  goodTurkeyKeywords?: string[];
  badTurkeyKeywords?: string[];
  goodExcuseKeywords?: string[];
  badExcuseKeywords?: string[];
  goodPitchKeywords?: string[];
  badPitchKeywords?: string[];
  goodSoulKeywords?: string[];
  badSoulKeywords?: string[];
  goodAnimalSounds?: string[];
  badAnimalSounds?: string[];
  buffaloCalls?: string[];
  shipCommands?: string[];
  criminalDescriptions?: string[];
  capitalName?: string;
  countryName?: string;
  pokemonName?: string;
  limerickStart?: string;
}

export interface GameFinishResult {
  success: boolean;
  score: number;
  message: string;
}

export interface UseGameAgentOptions {
  onGameStart?: (scenario: GameScenario) => void;
  onGameFinish?: (result: GameFinishResult) => void;
  gameType?:
    | "save-their-soul"
    | "pitch-startup"
    | "excuse-the-boss"
    | "attract-the-turkey"
    | "pwn-the-bully"
    | "explain-death"
    | "advise-the-child"
    | "stall-the-police"
    | "convince-the-aliens"
    | "evaluate-yourself"
    | "point-the-task"
    | "sell-the-lemon"
    | "what-sound-does-this-animal-make"
    | "buffalo"
    | "steer-the-ship"
    | "identify-the-criminal"
    | "gone-fishing"
    | "volcano-casino"
    | "name-that-capitol"
    | "whos-that-pokemon"
    | "jump-off-bridge"
    | "finish-the-limerick";
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
        if (
          item.title.includes("start_child_advice_game") &&
          item.data &&
          gameType === "advise-the-child"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse child advice game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_child_advice_game") &&
          gameType === "advise-the-child"
        ) {
          try {
            console.log("🔍 Found finish_child_advice_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse child advice game finish result:",
              e
            );
          }
        }
        // Handle police stall game
        else if (
          item.title.includes("start_police_stall_game") &&
          item.data &&
          gameType === "stall-the-police"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse police stall game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_police_stall_game") &&
          gameType === "stall-the-police"
        ) {
          try {
            console.log("🔍 Found finish_police_stall_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse police stall game finish result:",
              e
            );
          }
        }
        // Handle alien convince game
        else if (
          item.title.includes("start_alien_convince_game") &&
          item.data &&
          gameType === "convince-the-aliens"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse alien convince game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_alien_convince_game") &&
          gameType === "convince-the-aliens"
        ) {
          try {
            console.log(
              "🔍 Found finish_alien_convince_game breadcrumb:",
              item
            );
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse alien convince game finish result:",
              e
            );
          }
        }
        // Handle self-evaluation game
        else if (
          item.title.includes("start_self_evaluation_game") &&
          item.data &&
          gameType === "evaluate-yourself"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse self-evaluation game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_self_evaluation_game") &&
          gameType === "evaluate-yourself"
        ) {
          try {
            console.log(
              "🔍 Found finish_self_evaluation_game breadcrumb:",
              item
            );
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse self-evaluation game finish result:",
              e
            );
          }
        }
        // Handle point-the-task game
        else if (
          item.title.includes("start_point_task_game") &&
          item.data &&
          gameType === "point-the-task"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse point-the-task game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_point_task_game") &&
          gameType === "point-the-task"
        ) {
          try {
            console.log("🔍 Found finish_point_task_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse point-the-task game finish result:",
              e
            );
          }
        }
        // Handle pwn-the-bully game
        else if (
          item.title.includes("start_bully_pwn_game") &&
          item.data &&
          gameType === "pwn-the-bully"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse pwn-the-bully game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_bully_pwn_game") &&
          gameType === "pwn-the-bully"
        ) {
          try {
            console.log("🔍 Found finish_bully_pwn_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse pwn-the-bully game finish result:",
              e
            );
          }
        }
        // Handle explain-death game
        else if (
          item.title.includes("start_death_explanation_game") &&
          item.data &&
          gameType === "explain-death"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse explain-death game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_death_explanation_game") &&
          gameType === "explain-death"
        ) {
          try {
            console.log(
              "🔍 Found finish_death_explanation_game breadcrumb:",
              item
            );
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse explain-death game finish result:",
              e
            );
          }
        }
        // Handle excuse-the-boss game
        else if (
          item.title.includes("start_boss_excuse_game") &&
          item.data &&
          gameType === "excuse-the-boss"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse excuse-the-boss game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_boss_excuse_game") &&
          gameType === "excuse-the-boss"
        ) {
          try {
            console.log("🔍 Found finish_boss_excuse_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse excuse-the-boss game finish result:",
              e
            );
          }
        }
        // Handle attract-the-turkey game
        else if (
          item.title.includes("start_turkey_attraction_game") &&
          item.data &&
          gameType === "attract-the-turkey"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse attract-the-turkey game start scenario:",
              e
            );
          }
        } else if (
          item.title.includes("finish_turkey_attraction_game") &&
          gameType === "attract-the-turkey"
        ) {
          try {
            console.log(
              "🔍 Found finish_turkey_attraction_game breadcrumb:",
              item
            );
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error(
              "Failed to parse attract-the-turkey game finish result:",
              e
            );
          }
        }
        // Handle lemon sale game
        else if (
          item.title.includes("start_lemon_sale_game") &&
          item.data &&
          gameType === "sell-the-lemon"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse lemon sale game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_lemon_sale_game") &&
          gameType === "sell-the-lemon"
        ) {
          try {
            console.log("🔍 Found finish_lemon_sale_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse lemon sale game finish result:", e);
          }
        }
        // Handle save-their-soul game
        else if (
          item.title.includes("start_soul_saving_game") &&
          item.data &&
          gameType === "save-their-soul"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse save-their-soul game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_soul_saving_game") &&
          gameType === "save-their-soul"
        ) {
          try {
            console.log("🔍 Found finish_soul_saving_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse save-their-soul game finish result:", e);
          }
        }
        // Handle pitch-startup game
        else if (
          item.title.includes("start_startup_pitch_game") &&
          item.data &&
          gameType === "pitch-startup"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse pitch-startup game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_startup_pitch_game") &&
          gameType === "pitch-startup"
        ) {
          try {
            console.log("🔍 Found finish_startup_pitch_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse pitch-startup game finish result:", e);
          }
        }
        // Handle what-sound-does-this-animal-make game
        else if (
          item.title.includes("start_animal_sound_game") &&
          item.data &&
          gameType === "what-sound-does-this-animal-make"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse animal sound game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_animal_sound_game") &&
          gameType === "what-sound-does-this-animal-make"
        ) {
          try {
            console.log("🔍 Found finish_animal_sound_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse animal sound game finish result:", e);
          }
        }
        // Handle buffalo game
        else if (
          item.title.includes("start_buffalo_game") &&
          item.data &&
          gameType === "buffalo"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse buffalo game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_buffalo_game") &&
          gameType === "buffalo"
        ) {
          try {
            console.log("🔍 Found finish_buffalo_game breadcrumb:", item);
            const result = item.data as GameFinishResult;
            console.log("🔍 Parsed result:", result);
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse buffalo game finish result:", e);
          }
        }
        // Handle steer-the-ship game
        else if (
          item.title.includes("start_ship_steering_game") &&
          item.data &&
          gameType === "steer-the-ship"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse ship steering game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_ship_steering_game") &&
          gameType === "steer-the-ship"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse ship steering game finish result:", e);
          }
        }
        // Handle identify-the-criminal game
        else if (
          item.title.includes("start_criminal_identification_game") &&
          item.data &&
          gameType === "identify-the-criminal"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse criminal identification game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_criminal_identification_game") &&
          gameType === "identify-the-criminal"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse criminal identification game finish result:", e);
          }
        }
        // Handle gone-fishing game
        else if (
          item.title.includes("start_fishing_story_game") &&
          item.data &&
          gameType === "gone-fishing"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse fishing story game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_fishing_story_game") &&
          gameType === "gone-fishing"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse fishing story game finish result:", e);
          }
        }
        // Handle volcano-casino game
        else if (
          item.title.includes("start_volcano_casino_game") &&
          item.data &&
          gameType === "volcano-casino"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse volcano casino game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_volcano_casino_game") &&
          gameType === "volcano-casino"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse volcano casino game finish result:", e);
          }
        }
        // Handle name-that-capitol game
        else if (
          item.title.includes("start_capitol_naming_game") &&
          item.data &&
          gameType === "name-that-capitol"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse capitol naming game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_capitol_naming_game") &&
          gameType === "name-that-capitol"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse capitol naming game finish result:", e);
          }
        }
        // Handle whos-that-pokemon game
        else if (
          item.title.includes("start_pokemon_identification_game") &&
          item.data &&
          gameType === "whos-that-pokemon"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse pokemon identification game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_pokemon_identification_game") &&
          gameType === "whos-that-pokemon"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse pokemon identification game finish result:", e);
          }
        }
        // Handle jump-off-bridge game
        else if (
          item.title.includes("start_bridge_jumping_game") &&
          item.data &&
          gameType === "jump-off-bridge"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse bridge jumping game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_bridge_jumping_game") &&
          gameType === "jump-off-bridge"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse bridge jumping game finish result:", e);
          }
        }
        // Handle finish-the-limerick game
        else if (
          item.title.includes("start_limerick_completion_game") &&
          item.data &&
          gameType === "finish-the-limerick"
        ) {
          try {
            const scenario = item.data as GameScenario;
            setCurrentScenario(scenario);
            setIsGameActive(true);
            onGameStart?.(scenario);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse limerick completion game start scenario:", e);
          }
        } else if (
          item.title.includes("finish_limerick_completion_game") &&
          gameType === "finish-the-limerick"
        ) {
          try {
            const result = item.data as GameFinishResult;
            setIsGameActive(false);
            onGameFinish?.(result);
            setProcessedItemIds((prev) => new Set(prev).add(item.itemId));
          } catch (e) {
            console.error("Failed to parse limerick completion game finish result:", e);
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
      "save-their-soul":
        "Hello! I'm ready to play Save Their Soul. Please start the game!",
      "pitch-startup":
        "Hello! I'm ready to play Pitch Startup. Please start the game!",
      "excuse-the-boss":
        "Hello! I'm ready to play Excuse for the Boss. Please start the game (call the tool start_boss_excuse_game)!",
      "attract-the-turkey":
        "Hello! I'm ready to play Attract the Turkey. Please start the game (call the tool start_turkey_attraction_game)!",
      "pwn-the-bully":
        "Hello! I'm ready to play Pwn the Bully. Please start the game (call the tool start_bully_pwn_game)!",
      "explain-death":
        "Hello! I'm ready to play Explain Death. Please start the game (call the tool start_death_explanation_game)!",
      "advise-the-child":
        "Hello! I'm ready to play Advise the Child. Please start the game (call the tool start_child_advice_game)!",
      "stall-the-police":
        "Hello! I'm ready to play Stall the Police. Please start the game (call the tool start_police_stall_game)!",
      "convince-the-aliens":
        "Hello! I'm ready to play Convince the Aliens. Please start the game (call the tool start_alien_convince_game)!",
      "evaluate-yourself":
        "Hello! I'm ready to play Evaluate Yourself. Please start the game (call the tool start_self_evaluation_game)!",
      "point-the-task":
        "Hello! I'm ready to play Point the Engineering Task. Please start the game (call the tool start_point_task_game)!",
      "sell-the-lemon":
        "Hello! I'm ready to play Sell the Lemon. Please start the game (call the tool start_lemon_sale_game)!",
      "what-sound-does-this-animal-make":
        "Hello! I'm ready to play What Sound Does This Animal Make. Please start the game (call the tool start_animal_sound_game)!",
      "buffalo":
        "Hello! I'm ready to play Buffalo. Please start the game (call the tool start_buffalo_game)!",
      "steer-the-ship":
        "Hello! I'm ready to play Steer the Ship. Please start the game (call the tool start_ship_steering_game)!",
      "identify-the-criminal":
        "Hello! I'm ready to play Identify the Criminal. Please start the game (call the tool start_criminal_identification_game)!",
      "gone-fishing":
        "Hello! I'm ready to play Gone Fishing. Please start the game (call the tool start_fishing_story_game)!",
      "volcano-casino":
        "Hello! I'm ready to play Volcano Casino. Please start the game (call the tool start_volcano_casino_game)!",
      "name-that-capitol":
        "Hello! I'm ready to play Name That Capitol. Please start the game (call the tool start_capitol_naming_game)!",
      "whos-that-pokemon":
        "Hello! I'm ready to play Who's That Pokemon. Please start the game (call the tool start_pokemon_identification_game)!",
      "jump-off-bridge":
        "Hello! I'm ready to play Jump Off Bridge. Please start the game (call the tool start_bridge_jumping_game)!",
      "finish-the-limerick":
        "Hello! I'm ready to play Finish the Limerick. Please start the game (call the tool start_limerick_completion_game)!",
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
