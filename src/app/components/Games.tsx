"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import {
  allPlannedGames,
  getGameById,
  isGameImplemented,
} from "../../../games-orchard";
import { GameMetadata } from "../../../games-orchard/types";
import { useGameSession } from "../providers/GameSessionProvider";

// Fire TV mic key plugin
const MicKey = Capacitor.isNativePlatform()
  ? registerPlugin<any>("MicKey")
  : undefined;

export default function Games() {
  const [gameState, setGameState] = useState<
    "landing" | "spinning" | "playing" | "orchard"
  >("landing");
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [GameComponent, setGameComponent] =
    useState<React.ComponentType<any> | null>(null);

  // PTT state
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState<boolean>(false);
  const mKeyPressedRef = useRef(false);

  const {
    sendUserText,
    sessionStatus,
    isWebRTCReady,
    interrupt,
    pushToTalkStartNative,
    pushToTalkStopNative,
  } = useGameSession();

  // Debug logging for session state
  useEffect(() => {
    console.log("[Games] Session state update:", {
      sessionStatus,
      isWebRTCReady,
    });
  }, [sessionStatus, isWebRTCReady]);

  // Check for specific game in URL hash
  useEffect(() => {
    const gameId = window.location.hash.replace("#", "");
    if (gameId) {
      const game = allPlannedGames.find((g) => g.id === gameId);
      if (game) {
        setSelectedGame(game);

        // Load component if implemented
        if (isGameImplemented(game.id)) {
          const component = getGameById(game.id);
          setGameComponent(() => component);
        } else {
          setGameComponent(null);
        }
      }
    } else {
      // Default to Puh Lease Officer
      const defaultGame = allPlannedGames.find(
        (g) => g.id === "puh-lease-officer"
      );
      if (defaultGame) {
        setSelectedGame(defaultGame);
        if (isGameImplemented(defaultGame.id)) {
          const component = getGameById(defaultGame.id);
          setGameComponent(() => component);
        }
      }
    }
  }, []);

  // PTT handlers
  const handleTalkButtonDown = useCallback(async () => {
    console.log("[PTT] handleTalkButtonDown");
    console.log("[PTT] sessionStatus", sessionStatus);
    console.log("[PTT] isWebRTCReady", isWebRTCReady);
    if (sessionStatus !== "CONNECTED" || !isWebRTCReady) return;

    // Prevent multiple simultaneous PTT sessions
    if (isPTTUserSpeaking) {
      console.log("[PTT] Already speaking, ignoring additional keydown");
      return;
    }

    interrupt();
    setIsPTTUserSpeaking(true);
    await pushToTalkStartNative();
    console.log("[PTT] Starting push-to-talk");
  }, [
    sessionStatus,
    isWebRTCReady,
    isPTTUserSpeaking,
    interrupt,
    pushToTalkStartNative,
  ]);

  const handleTalkButtonUp = useCallback(async () => {
    console.log("[PTT] handleTalkButtonUp");
    if (sessionStatus !== "CONNECTED" || !isPTTUserSpeaking) return;

    setIsPTTUserSpeaking(false);
    await pushToTalkStopNative();
    console.log("[PTT] Stopping push-to-talk");
  }, [sessionStatus, isPTTUserSpeaking, pushToTalkStopNative]);

  // Handle native Fire TV mic key events
  useEffect(() => {
    if (!MicKey) return; // Only run on native platforms

    const handleNativeMicKey = (event: { type: string }) => {
      console.log(
        `[NativeMicKey] Event: ${event.type}, mKeyPressed: ${mKeyPressedRef.current}, isPTTUserSpeaking: ${isPTTUserSpeaking}`
      );

      if (event.type === "down") {
        // Prevent multiple calls when key is held down
        if (mKeyPressedRef.current) {
          console.log("[NativeMicKey] Key already pressed, ignoring repeat");
          return;
        }

        mKeyPressedRef.current = true;
        handleTalkButtonDown();
      } else if (event.type === "up") {
        mKeyPressedRef.current = false;
        handleTalkButtonUp();
      }
    };

    const listener = MicKey.addListener("micKey", handleNativeMicKey);

    return () => {
      listener?.remove();
    };
  }, [isPTTUserSpeaking, handleTalkButtonDown, handleTalkButtonUp]);

  const handleStartGame = () => {
    if (selectedGame && GameComponent) {
      setGameState("playing");
    }
  };

  const handleBackToLanding = () => {
    setGameState("landing");
    // Keep the selected game but don't reset it
  };

  const handleVisitOrchard = () => {
    setGameState("orchard");
  };

  const handleSelectGameFromOrchard = (game: GameMetadata) => {
    setSelectedGame(game);

    // Load component if implemented
    if (isGameImplemented(game.id)) {
      const component = getGameById(game.id);
      setGameComponent(() => component);
    } else {
      setGameComponent(null);
    }

    setGameState("playing");
  };

  const handleGameEnd = (_result: any) => {
    // Show result briefly then return to landing
    setTimeout(() => {
      handleBackToLanding();
    }, 3000);
  };

  const renderLandingPage = () => {
    const getConnectionStatus = () => {
      if (sessionStatus === "DISCONNECTED")
        return "Connecting to AI Game Host...";
      if (sessionStatus === "CONNECTING") return "Establishing connection...";
      if (sessionStatus === "CONNECTED" && !isWebRTCReady)
        return "Preparing game engine...";
      return "Ready to play!";
    };

    const isReady = sessionStatus === "CONNECTED" && isWebRTCReady;

    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <h1 className="text-8xl font-bold mb-12 text-center">microgamis!</h1>

        {/* Connection Status */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            {!isReady && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
            )}
            {isReady && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <span className="text-xl">{getConnectionStatus()}</span>
          </div>
        </div>

        {/* Selected Game Display */}
        {selectedGame && (
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{selectedGame.name}</h2>
            <p className="text-lg opacity-90 mb-4">
              {selectedGame.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {isReady ? (
            <>
              <button
                onClick={handleStartGame}
                disabled={!selectedGame || !GameComponent}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-2xl transition-colors transform hover:scale-105 disabled:transform-none"
              >
                {selectedGame && GameComponent
                  ? "START GAME"
                  : "Game Not Available"}
              </button>

              {/* Push-to-Talk Button */}
              <div className="text-center">
                <div className="text-sm text-white opacity-75 mb-2">
                  Hold to talk to AI Game Host
                </div>
              </div>

              <button
                onClick={handleVisitOrchard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition-colors transform hover:scale-105"
              >
                browse all games
              </button>
            </>
          ) : (
            <div className="text-lg opacity-75">
              Please wait while we connect...
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-600 to-teal-600 text-white">
      <h2 className="text-4xl font-bold mb-8">Spinning...</h2>
      <div className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500"></div>
        </div>
      </div>
    </div>
  );

  const renderOrchard = () => (
    <div className="h-full bg-gradient-to-br from-orange-600 to-amber-600 text-white p-8 overflow-y-auto">
      {/* <button
        onClick={handleBackToLanding}
        className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors z-10"
      >
        ← Back to Games
      </button> */}

      <div className="text-center mb-8 pt-16">
        <h1 className="text-6xl font-bold mb-4">🌳 The Orchard 🌳</h1>
        <p className="text-xl opacity-90">Choose your microgame adventure!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {allPlannedGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleSelectGameFromOrchard(game)}
            className={`bg-white bg-opacity-20 rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 hover:bg-opacity-30 ${
              isGameImplemented(game.id)
                ? "border-2 border-green-400"
                : "border-2 border-gray-400 opacity-75"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                {game.name}
              </h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-3">
                {game.description}
              </p>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="font-medium">
                    {"★".repeat(game.difficulty)}
                    {"☆".repeat(5 - game.difficulty)}
                  </span>
                </div>
                {game.requiresVoice && (
                  <div className="text-yellow-300 font-medium">
                    🎤 Voice Required
                  </div>
                )}
              </div>

              <div className="mt-4">
                {isGameImplemented(game.id) ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ✓ Ready to Play
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGamePlay = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-600 to-pink-600 text-white p-8">
      {/* <button
        onClick={handleBackToLanding}
        className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        ← Back to Games
      </button> */}

      {selectedGame && (
        <div className="w-full h-full">
          {GameComponent ? (
            <GameComponent
              onGameEnd={handleGameEnd}
              sendPlayerText={sendUserText}
            />
          ) : (
            <div className="text-center max-w-2xl mx-auto flex flex-col justify-center h-full">
              <h2 className="text-5xl font-bold mb-4">{selectedGame.name}</h2>
              <p className="text-xl mb-8">{selectedGame.description}</p>

              <div className="bg-white bg-opacity-20 rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4">Game Coming Soon!</h3>
                <p className="text-lg">
                  This game is currently under development. Each game will be a
                  10-second voice-interactive experience using the realtime AI
                  capabilities.
                </p>
                <p className="text-sm mt-4 opacity-75">
                  Category: {selectedGame.category} | Difficulty:{" "}
                  {selectedGame.difficulty}/5
                  {selectedGame.requiresVoice && " | Voice Required"}
                </p>
              </div>

              <button
                onClick={handleBackToLanding}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold text-xl transition-colors"
              >
                Play Another Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen">
      {gameState === "landing" && renderLandingPage()}
      {gameState === "spinning" && renderSpinner()}
      {gameState === "orchard" && renderOrchard()}
      {gameState === "playing" && renderGamePlay()}
    </div>
  );
}
