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

function SteerShipGame(props: Partial<GameControlProps>) {
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
  const [shipPosition, setShipPosition] = useState(50);
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
    gameType: "steer-the-ship",
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      updateMessage?.(
        "Captain! The ship is entering dangerous waters! Use voice commands to navigate!"
      );

      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.(
          "Shout your commands: LEFT! RIGHT! STRAIGHT! Save the crew!"
        );
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      const success = result.success === true;
      const score = result.score || 0;
      const message = result.message || "The voyage has ended!";

      console.log("🎮 Processed values:", { success, score, message });

      updateScore?.(score);
      endGame?.(success, message, score);
    },
  });

  useEffect(() => {
    updateMessage?.(
      "Welcome Captain! Prepare to navigate through the existential seas..."
    );

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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-blue-900 via-teal-900 to-black">
      <div className="bg-black border-4 border-cyan-400 rounded-lg shadow-2xl p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-cyan-400 p-3 bg-blue-900 rounded-lg border border-cyan-400">
            Navigation Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-cyan-400">
            ⚓ Steer the Ship ⛵
          </h2>
        </div>

        <div className="bg-blue-900 border-2 border-cyan-400 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-teal-800 border-2 border-teal-400 rounded-2xl rounded-bl-none p-4 max-w-md text-white">
                  <div className="text-sm text-teal-300 font-medium mb-1">
                    🎪 Cynical Host:
                  </div>
                  <div className="text-teal-100 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-cyan-800 border-2 border-cyan-400 rounded-2xl rounded-br-none p-4 max-w-md text-white">
                  <div className="text-sm text-cyan-300 font-medium mb-1">
                    ⚓ Captain's Orders:
                  </div>
                  <div className="text-cyan-100 text-lg">
                    {isPTTUserSpeaking || nativeIsPTTUserSpeaking
                      ? "📢 Shouting commands..."
                      : latestUser.startsWith("Hello! I'm ready to play")
                      ? "Press mic to shout commands"
                      : latestUser}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-cyan-400 text-lg">
              The ship awaits your commands, Captain...
            </div>
          )}
        </div>

        {/* Ship visualization */}
        <div className="relative h-20 bg-blue-800 border-2 border-cyan-400 rounded-lg overflow-hidden">
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 text-4xl transition-all duration-500"
            style={{ left: `${shipPosition}%` }}
          >
            ⛵
          </div>
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-2xl">🌊</div>
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-2xl">🏝️</div>
        </div>
      </div>

      {!Capacitor.isNativePlatform() &&
        hostFinishedSpeaking &&
        sessionStatus === "CONNECTED" &&
        isWebRTCReady && (
          <div className="fixed bottom-1/4 right-6 z-10">
            <div className="bg-cyan-800 border-2 border-cyan-400 rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xs text-cyan-300 mb-1">
                  Hold to Command
                </div>
                <button
                  onMouseDown={handleTalkButtonDown}
                  onMouseUp={handleTalkButtonUp}
                  onMouseLeave={handleTalkButtonUp}
                  onTouchStart={handleTalkButtonDown}
                  onTouchEnd={handleTalkButtonUp}
                  className={`w-16 h-16 rounded-full border-4 border-cyan-400 transition-all duration-150 ${
                    isPTTUserSpeaking
                      ? "bg-red-500 scale-110 shadow-lg"
                      : "bg-cyan-700 hover:bg-cyan-600"
                  }`}
                >
                  <div className="text-5xl">
                    {isPTTUserSpeaking ? "🔴" : "📢"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>🌊</span>
        <span>⚓</span>
        <span>⛵</span>
        <span>🧭</span>
        <span>🏴‍☠️</span>
      </div>
    </div>
  );
}

export default function SteerShipGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Steer the Ship"
      instructions="Navigate through dangerous waters using voice commands!"
      duration={30}
      {...props}
    >
      <SteerShipGame isPTTUserSpeaking={props.isPTTUserSpeaking} />
    </BaseGame>
  );
}