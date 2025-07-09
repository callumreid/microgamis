"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import BaseGame from "../BaseGame";
import { GameProps } from "../types";
import {
  useGameAgent,
  GameScenario,
  GameFinishResult,
} from "../../src/app/hooks/useGameAgent";
import { useGameSession } from "../../src/app/providers/GameSessionProvider";
import { useTranscript } from "../../src/app/contexts/TranscriptContext";

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  sendPlayerText?: (text: string) => void;
  updateScore?: (score: number) => void;
  startTimer?: () => void;
  gameState?: any;
  playSound?: (soundId: string) => void;
}

function DetermineSentienceGame(props: Partial<GameControlProps>) {
  const {
    endGame,
    updateMessage,
    updateScore,
    startTimer,
    sendPlayerText: _sendPlayerText,
    gameState,
  } = props;
  const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [currentTranscriptionText, setCurrentTranscriptionText] = useState("");
  const pttStartTimeRef = useRef<number>(0);

  // Push-to-talk functionality
  const {
    sessionStatus,
    isWebRTCReady,
    interrupt,
    pushToTalkStartNative,
    pushToTalkStopNative,
  } = useGameSession();

  // Real-time transcription display
  const { transcriptItems } = useTranscript();

  // Monitor transcription items - only capture user speech during PTT
  useEffect(() => {
    if (!isPTTUserSpeaking) {
      return;
    }

    // Find items that appeared since PTT started AND are marked as user role
    const userItemsSincePTT = transcriptItems
      .filter(
        (item) =>
          item.title &&
          item.title.trim() !== "" &&
          item.role === "user" &&
          item.createdAtMs > pttStartTimeRef.current
      )
      .sort((a, b) => b.createdAtMs - a.createdAtMs);

    if (userItemsSincePTT.length > 0) {
      const latestUserText = userItemsSincePTT[0].title;
      console.log("User speech during PTT:", latestUserText);
      setCurrentTranscriptionText(latestUserText || "");
    }
  }, [transcriptItems, isPTTUserSpeaking]);

  // Get latest host and user messages for speech bubble
  const getLatestTranscripts = useCallback(() => {
    const hostItems = transcriptItems
      .filter(
        (item) =>
          item.role === "assistant" && item.title && item.title.trim() !== ""
      )
      .sort((a, b) => b.createdAtMs - a.createdAtMs);

    const userItems = transcriptItems
      .filter(
        (item) => item.role === "user" && item.title && item.title.trim() !== ""
      )
      .sort((a, b) => b.createdAtMs - a.createdAtMs);

    return {
      latestHost: hostItems[0]?.title || "",
      latestUser: userItems[0]?.title || "",
    };
  }, [transcriptItems]);

  const { latestHost, latestUser } = getLatestTranscripts();

  const {
    startGame,
    sendPlayerText: _sendAgentText,
    isGameActive: _isGameActive,
  } = useGameAgent({
    gameType: "determine-sentience",
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      updateMessage?.(
        "Welcome to the AI Consciousness Lab! A smart-speaker awaits your evaluation..."
      );

      // Start timer after transcript reading (estimated 15 seconds)
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.(
          "Verdict time! Is this AI sentient or just a fancy waffle-iron? Make your call!"
        );
      }, 15000);
    },
    onGameFinish: (result: GameFinishResult) => {
      console.log("🎮 DetermineSentience onGameFinish called with result:", result);

      // Use the actual result values, handle undefined properly
      const success = result.success === true; // Ensure boolean
      const score = result.score || 0;
      
      let message: string;
      if (success) {
        message = result.message || "Correct! The AI springs to life, winks at you through its LED, and hums a jazz tune. You've passed the consciousness test!";
      } else {
        message = result.message || "Nice try, meat-unit. The smart-speaker reboots humming elevator jazz as the lights fade to black.";
      }

      console.log("🎮 Processed values:", { success, score, message });

      updateScore?.(score);

      // Let BaseGame handle the banner - just end the game
      console.log("🎮 Calling endGame with:", { success, message, score });
      endGame?.(success, message, score);
    },
  });

  // Start the game when component mounts (user has already clicked START GAME)
  useEffect(() => {
    updateMessage?.(
      "Welcome to Determine Sentience! Enter the sterile lab where consciousness meets silicon..."
    );

    // Start the game after a brief delay
    const timer = setTimeout(() => {
      startGame();
    }, 1000);

    return () => clearTimeout(timer);
  }, [startGame]);

  // Push-to-talk handlers
  const handleTalkButtonDown = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isWebRTCReady) return;
    if (isPTTUserSpeaking) return;
    interrupt();
    pttStartTimeRef.current = Date.now(); // Mark when PTT started
    setIsPTTUserSpeaking(true);
    setCurrentTranscriptionText(""); // Clear previous text
    await pushToTalkStartNative();
    console.log("PTT started at:", pttStartTimeRef.current);
  }, [
    sessionStatus,
    isWebRTCReady,
    isPTTUserSpeaking,
    interrupt,
    pushToTalkStartNative,
  ]);

  const handleTalkButtonUp = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isPTTUserSpeaking) return;

    setIsPTTUserSpeaking(false);
    await pushToTalkStopNative();
    console.log("PTT stopped. Final text:", currentTranscriptionText);
  }, [
    sessionStatus,
    isPTTUserSpeaking,
    pushToTalkStopNative,
    currentTranscriptionText,
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 max-w-4xl w-full mt-16 border-4 border-blue-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-200">
            🤖💭 Determine Sentience
          </h2>
          <div className="text-lg font-semibold text-blue-200 p-3 bg-blue-900 rounded-lg border-2 border-blue-500">
            Time: {gameState?.timeRemaining || 20}s
          </div>
        </div>
        {/* Speech Bubble - AI lab theme */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-blue-500 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {/* Host/Lab Evaluator Speech Bubble */}
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 border-3 border-slate-500 rounded-2xl rounded-bl-none p-4 max-w-md text-white shadow-lg">
                  <div className="text-sm text-slate-300 font-medium mb-1">
                    🔬 Lab Host:
                  </div>
                  <div className="text-slate-100 text-lg font-bold">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {/* User Speech Bubble */}
          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 border-3 border-blue-500 rounded-2xl rounded-br-none p-4 max-w-md text-white shadow-lg">
                  <div className="text-sm text-blue-200 font-medium mb-1">
                    🧠 You (Evaluator):
                  </div>
                  <div className="text-blue-100 text-lg font-semibold">
                    {isPTTUserSpeaking
                      ? currentTranscriptionText || "🎤 Analyzing consciousness..."
                      : latestUser || "Press mic to make your verdict"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No conversation yet */}
          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-blue-300 text-lg font-medium">
              The smart-speaker sits silently... waiting for your consciousness evaluation...
            </div>
          )}
        </div>
      </div>

      {/* Push-to-Talk Button - Only on Web, Fixed Position */}
      {!Capacitor.isNativePlatform() &&
        hostFinishedSpeaking &&
        sessionStatus === "CONNECTED" &&
        isWebRTCReady && (
          <div className="fixed bottom-6 right-6 z-10">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-500 rounded-full p-4 shadow-xl">
              <div className="text-center">
                <div className="text-xs text-blue-800 mb-1 font-bold">
                  Hold to Judge
                </div>
                <button
                  onMouseDown={handleTalkButtonDown}
                  onMouseUp={handleTalkButtonUp}
                  onMouseLeave={handleTalkButtonUp}
                  onTouchStart={handleTalkButtonDown}
                  onTouchEnd={handleTalkButtonUp}
                  className={`w-16 h-16 rounded-full border-4 border-blue-600 transition-all duration-150 ${
                    isPTTUserSpeaking
                      ? "bg-red-500 scale-110 shadow-lg"
                      : "bg-blue-400 hover:bg-blue-500"
                  }`}
                >
                  <div className="text-5xl">
                    {isPTTUserSpeaking ? "🔴" : "🤖"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Decorative elements - AI lab themed */}
      <div className="flex justify-center space-x-3 text-2xl opacity-40 mt-4">
        <span>🔬</span>
        <span>🤖</span>
        <span>💭</span>
        <span>🧠</span>
        <span>💻</span>
        <span>⚡</span>
      </div>
    </div>
  );
}

export default function DetermineSentienceGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Determine Sentience"
      instructions="A smart-speaker sits on a lab table. After hearing an interview transcript, you must determine: is this thing actually sentient or just a fancy waffle-iron? Choose wisely."
      duration={20}
      {...props}
    >
      <DetermineSentienceGame />
    </BaseGame>
  );
}