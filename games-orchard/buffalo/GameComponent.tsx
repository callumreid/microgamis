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
  isPTTUserSpeaking?: boolean;
}

function BuffaloGame(props: Partial<GameControlProps>) {
  const {
    endGame,
    updateMessage,
    updateScore,
    startTimer,
    sendPlayerText: _sendPlayerText,
    gameState,
    isPTTUserSpeaking: nativeIsPTTUserSpeaking,
  } = props;
  const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [buffaloCalls, setBuffaloCalls] = useState<string[]>([]);
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
    gameType: "buffalo",
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      const calls = scenario.buffaloCalls || [];
      setBuffaloCalls(calls);
      updateMessage?.(
        "The buffalo herd approaches! Listen to their pattern and repeat it perfectly!"
      );

      // Start timer after host finishes speaking
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.(
          "Quick! Follow the buffalo pattern or face the stampede!"
        );
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      const success = result.success === true;
      const score = result.score || 0;
      const message = result.message || "The buffalo have spoken!";

      console.log("🎮 Processed values:", { success, score, message });

      updateScore?.(score);
      endGame?.(success, message, score);
    },
  });

  // Start the game when component mounts
  useEffect(() => {
    updateMessage?.(
      "Welcome to Buffalo! The herd's wisdom will test your pattern recognition..."
    );

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
    pttStartTimeRef.current = Date.now();
    setIsPTTUserSpeaking(true);
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
  }, [sessionStatus, isPTTUserSpeaking, pushToTalkStopNative]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-amber-900 via-brown-900 to-black">
      <div className="bg-black border-4 border-orange-600 rounded-lg shadow-2xl p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-orange-400 p-3 bg-amber-900 rounded-lg border border-orange-600">
            Buffalo Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
            🦬 Buffalo Pattern Challenge 🦬
          </h2>
        </div>

        {/* Speech Bubble - Centered and Prominent */}
        <div className="bg-amber-900 border-2 border-orange-600 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {/* Host Speech Bubble */}
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-brown-800 border-2 border-brown-400 rounded-2xl rounded-bl-none p-4 max-w-md text-white">
                  <div className="text-sm text-brown-300 font-medium mb-1">
                    🎪 Cynical Host:
                  </div>
                  <div className="text-brown-100 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {/* User Speech Bubble */}
          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-orange-800 border-2 border-orange-400 rounded-2xl rounded-br-none p-4 max-w-md text-white">
                  <div className="text-sm text-orange-300 font-medium mb-1">
                    🎤 Your Pattern:
                  </div>
                  <div className="text-orange-100 text-lg">
                    {isPTTUserSpeaking || nativeIsPTTUserSpeaking
                      ? "🦬 Following the buffalo pattern..."
                      : latestUser.startsWith("Hello! I'm ready to play")
                      ? "Press mic to repeat the pattern"
                      : latestUser}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No conversation yet */}
          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-orange-400 text-lg">
              The buffalo herd is gathering...
            </div>
          )}
        </div>

        {/* Buffalo Pattern Display */}
        {buffaloCalls.length > 0 && (
          <div className="text-center">
            <div className="text-xl text-orange-400 mb-2">Pattern:</div>
            <div className="text-2xl text-orange-300 font-bold">
              {buffaloCalls.join(" → ")}
            </div>
          </div>
        )}
      </div>

      {/* Push-to-Talk Button - Only on Web, Fixed Position */}
      {!Capacitor.isNativePlatform() &&
        hostFinishedSpeaking &&
        sessionStatus === "CONNECTED" &&
        isWebRTCReady && (
          <div className="fixed bottom-1/4 right-6 z-10">
            <div className="bg-orange-800 border-2 border-orange-400 rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xs text-orange-300 mb-1">
                  Hold to Follow Pattern
                </div>
                <button
                  onMouseDown={handleTalkButtonDown}
                  onMouseUp={handleTalkButtonUp}
                  onMouseLeave={handleTalkButtonUp}
                  onTouchStart={handleTalkButtonDown}
                  onTouchEnd={handleTalkButtonUp}
                  className={`w-16 h-16 rounded-full border-4 border-orange-400 transition-all duration-150 ${
                    isPTTUserSpeaking
                      ? "bg-red-500 scale-110 shadow-lg"
                      : "bg-orange-700 hover:bg-orange-600"
                  }`}
                >
                  <div className="text-5xl">
                    {isPTTUserSpeaking ? "🔴" : "🎤"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Decorative elements - Buffalo themed */}
      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>🦬</span>
        <span>🌾</span>
        <span>🦬</span>
        <span>🌾</span>
        <span>🦬</span>
      </div>
    </div>
  );
}

export default function BuffaloGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Buffalo"
      instructions="Follow the buffalo pattern or face the stampede of consciousness!"
      duration={30}
      {...props}
    >
      <BuffaloGame isPTTUserSpeaking={props.isPTTUserSpeaking} />
    </BaseGame>
  );
}