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

function GoneFishingGame(props: Partial<GameControlProps>) {
  const {
    endGame,
    updateMessage,
    updateScore,
    startTimer,
    gameState,
    isPTTUserSpeaking: nativeIsPTTUserSpeaking,
  } = props;
  const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const pttStartTimeRef = useRef<number>(0);

  const {
    sessionStatus,
    isWebRTCReady,
    interrupt,
    pushToTalkStartNative,
    pushToTalkStopNative,
  } = useGameSession();

  const { transcriptItems } = useTranscript();

  const getLatestTranscripts = useCallback(() => {
    const hostItems = transcriptItems
      .filter((item) => item.role === "assistant" && item.title && item.title.trim() !== "")
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
    const userItems = transcriptItems
      .filter((item) => item.role === "user" && item.title && item.title.trim() !== "")
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
    gameType: "gone-fishing",
    onGameStart: (scenario: GameScenario) => {
      updateMessage?.("You're back from your fishing trip! The boys are waiting to hear your story!");
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.("Tell us about the one that got away!");
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      const success = result.success === true;
      const score = result.score || 0;
      const message = result.message || "That's a fish tale for the ages!";
      updateScore?.(score);
      endGame?.(success, message, score);
    },
  });

  useEffect(() => {
    updateMessage?.("Welcome to the fishing lodge! Time to share your story...");
    const timer = setTimeout(() => {
      startGame();
    }, 1000);
    return () => clearTimeout(timer);
  }, [startGame]);

  const handleTalkButtonDown = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isWebRTCReady) return;
    if (isPTTUserSpeaking) return;
    interrupt();
    pttStartTimeRef.current = Date.now();
    setIsPTTUserSpeaking(true);
    await pushToTalkStartNative();
  }, [sessionStatus, isWebRTCReady, isPTTUserSpeaking, interrupt, pushToTalkStartNative]);

  const handleTalkButtonUp = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isPTTUserSpeaking) return;
    setIsPTTUserSpeaking(false);
    await pushToTalkStopNative();
  }, [sessionStatus, isPTTUserSpeaking, pushToTalkStopNative]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-teal-900 via-blue-900 to-black">
      <div className="bg-black border-4 border-teal-400 rounded-lg shadow-2xl p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-teal-400 p-3 bg-blue-900 rounded-lg border border-teal-400">
            Fish Tale Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-teal-400">
            🎣 Gone Fishing 🐟
          </h2>
        </div>

        <div className="bg-blue-900 border-2 border-teal-400 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-teal-800 border-2 border-teal-400 rounded-2xl rounded-bl-none p-4 max-w-md text-white">
                  <div className="text-sm text-teal-300 font-medium mb-1">🎪 Cynical Host:</div>
                  <div className="text-teal-100 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-blue-800 border-2 border-blue-400 rounded-2xl rounded-br-none p-4 max-w-md text-white">
                  <div className="text-sm text-blue-300 font-medium mb-1">🎣 Your Fish Tale:</div>
                  <div className="text-blue-100 text-lg">
                    {isPTTUserSpeaking || nativeIsPTTUserSpeaking
                      ? "🐟 Spinning the tale..."
                      : latestUser.startsWith("Hello! I'm ready to play")
                      ? "Press mic to tell your story"
                      : latestUser}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-teal-400 text-lg">
              The fishing lodge awaits your story...
            </div>
          )}
        </div>
      </div>

      {!Capacitor.isNativePlatform() && hostFinishedSpeaking && sessionStatus === "CONNECTED" && isWebRTCReady && (
        <div className="fixed bottom-1/4 right-6 z-10">
          <div className="bg-teal-800 border-2 border-teal-400 rounded-full p-4 shadow-lg">
            <div className="text-center">
              <div className="text-xs text-teal-300 mb-1">Hold to Tell Story</div>
              <button
                onMouseDown={handleTalkButtonDown}
                onMouseUp={handleTalkButtonUp}
                onMouseLeave={handleTalkButtonUp}
                onTouchStart={handleTalkButtonDown}
                onTouchEnd={handleTalkButtonUp}
                className={`w-16 h-16 rounded-full border-4 border-teal-400 transition-all duration-150 ${
                  isPTTUserSpeaking
                    ? "bg-red-500 scale-110 shadow-lg"
                    : "bg-teal-700 hover:bg-teal-600"
                }`}
              >
                <div className="text-5xl">{isPTTUserSpeaking ? "🔴" : "🎣"}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>🎣</span><span>🐟</span><span>🌊</span><span>⛵</span><span>🦈</span>
      </div>
    </div>
  );
}

export default function GoneFishingGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Gone Fishing"
      instructions="Tell the perfect fishing story to impress your cynical buddies!"
      duration={30}
      {...props}
    >
      <GoneFishingGame isPTTUserSpeaking={props.isPTTUserSpeaking} />
    </BaseGame>
  );
}