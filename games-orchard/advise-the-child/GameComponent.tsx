"use client";
import React, { useState, useEffect, useCallback } from "react";
import BaseGame from "../BaseGame";
import { GameProps } from "../types";
import {
  useGameAgent,
  GameScenario,
  GameFinishResult,
} from "../../src/app/hooks/useGameAgent";
import { useGameSession } from "../../src/app/providers/GameSessionProvider";

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  sendPlayerText?: (text: string) => void;
  updateScore?: (score: number) => void;
  startTimer?: () => void;
  gameState?: any;
  playSound?: (soundId: string) => void;
}

function AdviseTheChildGame(props: Partial<GameControlProps>) {
  const {
    endGame,
    updateMessage,
    updateScore,
    startTimer,
    sendPlayerText: _sendPlayerText,
  } = props;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(
    null
  );
  const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);

  // Push-to-talk functionality
  const {
    sessionStatus,
    isWebRTCReady,
    interrupt,
    pushToTalkStartNative,
    pushToTalkStopNative,
  } = useGameSession();

  const {
    startGame,
    sendPlayerText: _sendAgentText,
    isGameActive: _isGameActive,
  } = useGameAgent({
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      setCurrentScenario(scenario);
      setGameStarted(true);
      updateMessage?.(
        "The AI host is presenting your scenario. Listen carefully and give your best advice!"
      );

      // Start timer after host finishes speaking (estimated 8 seconds for host to speak)
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
        updateMessage?.(
          "Now give your advice! You have 30 seconds to respond thoughtfully."
        );
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      console.log("Game finished with result:", result);
      updateScore?.(result.score);
      endGame?.(result.success, result.message, result.score);
    },
  });

  // Start the game when component mounts (user has already clicked START GAME)
  useEffect(() => {
    updateMessage?.(
      "Welcome to Advise the Child! The AI game host is preparing a scenario for you..."
    );

    // Start the game after a brief delay
    const timer = setTimeout(() => {
      startGame();
    }, 1000);

    return () => clearTimeout(timer);
  }, [startGame]);

  // Push-to-talk handlers
  const handleTalkButtonDown = useCallback(() => {
    if (sessionStatus !== "CONNECTED" || !isWebRTCReady) return;
    if (isPTTUserSpeaking) return;
    interrupt();
    setIsPTTUserSpeaking(true);
    pushToTalkStartNative();
  }, [sessionStatus, isWebRTCReady, isPTTUserSpeaking, interrupt, pushToTalkStartNative]);

  const handleTalkButtonUp = useCallback(() => {
    if (sessionStatus !== "CONNECTED" || !isPTTUserSpeaking) return;
    setIsPTTUserSpeaking(false);
    pushToTalkStopNative();
  }, [sessionStatus, isPTTUserSpeaking, pushToTalkStopNative]);

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 rounded-lg p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          👶 Advise The Child
        </h2>

        {/* Game status display */}
        <div className="bg-yellow-100 rounded-lg p-6 mb-6 border-4 border-yellow-300">
          <div className="text-6xl mb-4">🎤</div>
          <div className="text-lg font-bold text-gray-700 mb-2">
            AI Game Host Active
          </div>
          <div className="text-md text-gray-600 mb-4">
            {!gameStarted
              ? "The AI host is preparing your scenario..."
              : !hostFinishedSpeaking
              ? "🎙️ AI host is speaking... Listen carefully!"
              : "⏰ Your turn! Give your advice now!"}
          </div>
          {currentScenario && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
              <div className="text-sm text-blue-800 font-medium">
                Current Scenario: {currentScenario.problem}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-3xl mb-2">💡</div>
          <p className="text-lg font-semibold text-blue-800 mb-2">
            Give thoughtful advice to help the child!
          </p>
          <p className="text-sm text-blue-600">
            Be empathetic, helpful, and age-appropriate. The AI will evaluate
            your response.
          </p>
        </div>

        {/* Push-to-Talk Button */}
        {hostFinishedSpeaking && sessionStatus === "CONNECTED" && isWebRTCReady && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-yellow-800 mb-2">
                Hold the button to give your advice
              </div>
              <button
                onMouseDown={handleTalkButtonDown}
                onMouseUp={handleTalkButtonUp}
                onMouseLeave={handleTalkButtonUp}
                onTouchStart={handleTalkButtonDown}
                onTouchEnd={handleTalkButtonUp}
                className={`w-20 h-20 rounded-full border-4 border-yellow-400 transition-all duration-150 ${
                  isPTTUserSpeaking
                    ? "bg-red-500 scale-110 shadow-lg"
                    : "bg-yellow-200 hover:bg-yellow-300"
                }`}
              >
                <div className="text-3xl">
                  {isPTTUserSpeaking ? "🔴" : "🎤"}
                </div>
              </button>
              <div className="text-xs text-yellow-700 mt-2">
                {isPTTUserSpeaking ? "Speaking..." : "Click & Hold to Talk"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="flex justify-center space-x-4 text-2xl opacity-50">
        <span>❤️</span>
        <span>🤗</span>
        <span>💪</span>
        <span>🌟</span>
      </div>
    </div>
  );
}

export default function AdviseTheChildGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Advise The Child"
      instructions="An AI game host will present a child's problem - give your best advice!"
      duration={30}
      {...props}
    >
      <AdviseTheChildGame />
    </BaseGame>
  );
}
