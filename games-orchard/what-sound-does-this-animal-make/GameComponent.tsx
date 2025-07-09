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

function AnimalSoundGame(props: Partial<GameControlProps>) {
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
  const [currentAnimal, setCurrentAnimal] = useState<string>("");
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
    gameType: "what-sound-does-this-animal-make",
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      const animal = scenario.animalName || "mysterious creature";
      setCurrentAnimal(animal);
      updateMessage?.(
        `Quick! What sound does a ${animal} make? Prove you're not a robot!`
      );

      // Start timer after host finishes speaking (estimated 8 seconds for host to speak)
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.(
          `Make the ${animal} sound NOW! 30 seconds to prove your humanity!`
        );
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      const success = result.success === true;
      const score = result.score || 0;
      const message = result.message || "The animal sound test is complete!";

      console.log("🎮 Processed values:", { success, score, message });

      updateScore?.(score);
      endGame?.(success, message, score);
    },
  });

  // Start the game when component mounts
  useEffect(() => {
    updateMessage?.(
      "Welcome to Animal Sound Verification! Preparing your humanity test..."
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="bg-black border-4 border-amber-400 rounded-lg shadow-2xl p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-amber-400 p-3 bg-gray-900 rounded-lg border border-amber-400">
            Humanity Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-amber-400">
            🐾 Animal Sound Verification Test 🎤
          </h2>
        </div>

        {/* Speech Bubble - Centered and Prominent */}
        <div className="bg-gray-900 border-2 border-amber-400 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {/* Host Speech Bubble */}
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-purple-800 border-2 border-purple-400 rounded-2xl rounded-bl-none p-4 max-w-md text-white">
                  <div className="text-sm text-purple-300 font-medium mb-1">
                    🎪 Cynical Host:
                  </div>
                  <div className="text-purple-100 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {/* User Speech Bubble */}
          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-amber-900 border-2 border-amber-400 rounded-2xl rounded-br-none p-4 max-w-md text-white">
                  <div className="text-sm text-amber-300 font-medium mb-1">
                    🎤 Your Sound:
                  </div>
                  <div className="text-amber-100 text-lg">
                    {isPTTUserSpeaking || nativeIsPTTUserSpeaking
                      ? "🔊 Making animal sounds..."
                      : latestUser.startsWith("Hello! I'm ready to play")
                      ? "Press mic to make the sound"
                      : latestUser}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No conversation yet */}
          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-amber-400 text-lg">
              Animal sound verification will begin shortly...
            </div>
          )}
        </div>

        {/* Current Animal Display */}
        {currentAnimal && (
          <div className="text-center text-3xl text-amber-400 font-bold mb-4">
            Current Animal: {currentAnimal.toUpperCase()}
          </div>
        )}
      </div>

      {/* Push-to-Talk Button - Only on Web, Fixed Position */}
      {!Capacitor.isNativePlatform() &&
        hostFinishedSpeaking &&
        sessionStatus === "CONNECTED" &&
        isWebRTCReady && (
          <div className="fixed bottom-1/4 right-6 z-10">
            <div className="bg-amber-900 border-2 border-amber-400 rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xs text-amber-300 mb-1">
                  Hold to Make Sound
                </div>
                <button
                  onMouseDown={handleTalkButtonDown}
                  onMouseUp={handleTalkButtonUp}
                  onMouseLeave={handleTalkButtonUp}
                  onTouchStart={handleTalkButtonDown}
                  onTouchEnd={handleTalkButtonUp}
                  className={`w-16 h-16 rounded-full border-4 border-amber-400 transition-all duration-150 ${
                    isPTTUserSpeaking
                      ? "bg-red-500 scale-110 shadow-lg"
                      : "bg-amber-700 hover:bg-amber-600"
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

      {/* Decorative elements - Animal themed */}
      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>🐶</span>
        <span>🐱</span>
        <span>🐮</span>
        <span>🐷</span>
        <span>🦆</span>
        <span>🐸</span>
        <span>🦁</span>
        <span>🐴</span>
      </div>
    </div>
  );
}

export default function AnimalSoundGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="What Sound Does This Animal Make?"
      instructions="Make the correct animal sound to prove you're not a robot!"
      duration={30}
      {...props}
    >
      <AnimalSoundGame isPTTUserSpeaking={props.isPTTUserSpeaking} />
    </BaseGame>
  );
}