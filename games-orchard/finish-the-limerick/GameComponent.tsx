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

function FinishLimerickGame(props: Partial<GameControlProps>) {
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
  const [limerickStart, setLimerickStart] = useState("");
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
    gameType: "finish-the-limerick",
    onGameStart: (scenario: GameScenario) => {
      const start = scenario.limerickStart || "There once was a man from...";
      setLimerickStart(start);
      updateMessage?.("Time for crude poetry! I'll start, you finish!");
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.("Complete this limerick with maximum vulgarity!");
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      const success = result.success === true;
      const score = result.score || 0;
      const message = result.message || "Poetry is officially dead!";
      updateScore?.(score);
      endGame?.(success, message, score);
    },
  });

  useEffect(() => {
    updateMessage?.("Welcome to the gutter of literature!");
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-900 via-pink-900 to-black">
      <div className="bg-black border-4 border-pink-400 rounded-lg shadow-2xl p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-pink-400 p-3 bg-purple-900 rounded-lg border border-pink-400">
            Poetry Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-400">
            ✍️ Finish the Limerick 🎭
          </h2>
        </div>

        <div className="bg-purple-900 border-2 border-pink-400 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-pink-800 border-2 border-pink-400 rounded-2xl rounded-bl-none p-4 max-w-md text-white">
                  <div className="text-sm text-pink-300 font-medium mb-1">🎪 Cynical Host:</div>
                  <div className="text-pink-100 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-purple-800 border-2 border-purple-400 rounded-2xl rounded-br-none p-4 max-w-md text-white">
                  <div className="text-sm text-purple-300 font-medium mb-1">✍️ Your Verse:</div>
                  <div className="text-purple-100 text-lg">
                    {isPTTUserSpeaking || nativeIsPTTUserSpeaking
                      ? "🎭 Composing crude poetry..."
                      : latestUser.startsWith("Hello! I'm ready to play")
                      ? "Press mic to finish limerick"
                      : latestUser}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-pink-400 text-lg">
              Preparing poetic profanity...
            </div>
          )}
        </div>

        {limerickStart && (
          <div className="text-center bg-purple-800 p-4 rounded-lg border-2 border-pink-400">
            <div className="text-pink-400 font-bold mb-2">Limerick Start:</div>
            <div className="text-pink-300 text-lg italic">"{limerickStart}..."</div>
          </div>
        )}
      </div>

      {!Capacitor.isNativePlatform() && hostFinishedSpeaking && sessionStatus === "CONNECTED" && isWebRTCReady && (
        <div className="fixed bottom-1/4 right-6 z-10">
          <div className="bg-pink-800 border-2 border-pink-400 rounded-full p-4 shadow-lg">
            <div className="text-center">
              <div className="text-xs text-pink-300 mb-1">Hold to Rhyme</div>
              <button
                onMouseDown={handleTalkButtonDown}
                onMouseUp={handleTalkButtonUp}
                onMouseLeave={handleTalkButtonUp}
                onTouchStart={handleTalkButtonDown}
                onTouchEnd={handleTalkButtonUp}
                className={`w-16 h-16 rounded-full border-4 border-pink-400 transition-all duration-150 ${
                  isPTTUserSpeaking
                    ? "bg-red-500 scale-110 shadow-lg"
                    : "bg-pink-700 hover:bg-pink-600"
                }`}
              >
                <div className="text-5xl">{isPTTUserSpeaking ? "🔴" : "✍️"}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>✍️</span><span>🎭</span><span>📜</span><span>🍺</span><span>💩</span>
      </div>
    </div>
  );
}

export default function FinishLimerickGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Finish the Limerick"
      instructions="Complete the crude limerick with maximum vulgarity!"
      duration={30}
      {...props}
    >
      <FinishLimerickGame isPTTUserSpeaking={props.isPTTUserSpeaking} />
    </BaseGame>
  );
}