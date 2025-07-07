"use client";
import React, { useState, useEffect } from "react";
import BaseGame from "../BaseGame";
import { GameProps } from "../types";

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (handler: (transcript: string) => void) => void;
  sendVoiceMessage?: (message: string) => void;
  updateScore?: (score: number) => void;
  gameState?: any;
  playSound?: (soundId: string) => void;
}

function AdviseTheChildGame(props: Partial<GameControlProps>) {
  const { endGame, updateMessage, onVoiceInput, sendVoiceMessage } = props;
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game
  useEffect(() => {
    if (!isInitialized) {
      updateMessage?.(
        "Welcome to Advise the Child! The AI game host is preparing a scenario for you..."
      );

      // Send a message to trigger the AI to start the game
      if (sendVoiceMessage) {
        sendVoiceMessage(
          "Hello! I'm ready to play Advise the Child. Please start the game!"
        );
      }

      setIsInitialized(true);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  // Set up voice input handler
  useEffect(() => {
    if (onVoiceInput && gameStarted) {
      const handleVoiceInput = (transcript: string) => {
        // Forward the transcript directly to the AI agent
        if (sendVoiceMessage) {
          sendVoiceMessage(transcript);
        }
      };

      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, gameStarted, sendVoiceMessage]);

  // Listen for game end events from the AI agent
  useEffect(() => {
    const handleGameEnd = (event: CustomEvent) => {
      const { success, score, message } = event.detail;
      endGame?.(success, message, score);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "finish_child_advice_game",
        handleGameEnd as EventListener
      );

      return () => {
        window.removeEventListener(
          "finish_child_advice_game",
          handleGameEnd as EventListener
        );
      };
    }
  }, [endGame]);

  // Listen for any voice messages that might indicate the game has started
  useEffect(() => {
    if (isInitialized && !gameStarted) {
      // Set a timeout to mark the game as started after a brief delay
      const timer = setTimeout(() => {
        setGameStarted(true);
        updateMessage?.(
          "The AI game host is presenting your scenario. Listen carefully and give your best advice!"
        );
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, gameStarted, updateMessage]);

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
            {gameStarted
              ? "Listen to the AI host and respond with your advice!"
              : "The AI host is preparing your scenario..."}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-3xl mb-2">💡</div>
          <p className="text-lg font-semibold text-blue-800 mb-2">
            Give thoughtful advice to help the child!
          </p>
          <p className="text-sm text-blue-600">
            Be empathetic, helpful, and age-appropriate. The AI will evaluate
            your response.
          </p>
        </div>
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
      duration={15}
      {...props}
    >
      <AdviseTheChildGame />
    </BaseGame>
  );
}
