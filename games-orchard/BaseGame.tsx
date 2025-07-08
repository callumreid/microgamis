"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GameProps, GameState } from "./types";

interface BaseGameProps extends GameProps {
  title: string;
  instructions: string;
  duration?: number; // in seconds, defaults to 10
  children: React.ReactNode;
}

export default function BaseGame({
  title,
  instructions,
  duration = 10,
  onGameEnd,
  sendPlayerText,
  playSound,
  children,
}: BaseGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    timeRemaining: duration,
    score: 0,
    message: instructions,
  });

  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [timerStarted, setTimerStarted] = useState(false);

  // Countdown before game starts
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (playSound) {
          playSound("countdown-beep");
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      startGame();
    }
  }, [countdown, showCountdown, playSound]);

  // Game timer - only runs when timer is explicitly started
  useEffect(() => {
    if (
      gameState.status === "playing" &&
      gameState.timeRemaining > 0 &&
      timerStarted
    ) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (
      gameState.status === "playing" &&
      gameState.timeRemaining === 0
    ) {
      endGame(false, "Time's up!");
    }
  }, [gameState.status, gameState.timeRemaining, timerStarted]);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      // Don't set message here - let the game component handle it
    }));

    if (sendPlayerText) {
      sendPlayerText(`${title} begins now! ${instructions}`);
    }

    if (playSound) {
      playSound("game-start");
    }
  }, [title, instructions, sendPlayerText, playSound]);

  const endGame = useCallback(
    (success: boolean, message?: string, score?: number) => {
      const finalScore = score ?? gameState.score;
      const timeElapsed = duration - gameState.timeRemaining;

      setGameState((prev) => ({
        ...prev,
        status: success ? "completed" : "failed",
        score: finalScore,
        message: message || (success ? "Well done!" : "Better luck next time!"),
      }));

      if (playSound) {
        playSound(success ? "game-win" : "game-lose");
      }

      // Delay the callback to show the result briefly
      setTimeout(() => {
        onGameEnd({
          success,
          score: finalScore,
          message: message,
          timeElapsed,
        });
      }, 2000);
    },
    [gameState.score, gameState.timeRemaining, duration, onGameEnd, playSound]
  );

  // Provide game control functions to children
  const gameControls = {
    endGame,
    updateScore: (score: number) =>
      setGameState((prev) => ({ ...prev, score })),
    updateMessage: (message: string) =>
      setGameState((prev) => ({ ...prev, message })),
    startTimer: () => setTimerStarted(true),
    gameState,
    sendPlayerText,
    playSound,
  };

  if (showCountdown) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="text-8xl font-bold mb-4">{countdown}</div>
        <p className="text-xl text-center max-w-md">{instructions}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {React.cloneElement(children as React.ReactElement, {
        ...gameControls,
      })}
    </div>
  );

  // return (
  //   <div className="flex flex-col h-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
  //     {/* Header */}
  //     <div className="flex justify-between items-center p-4 bg-black bg-opacity-20">
  //       <h1 className="text-2xl font-bold">{title}</h1>
  //       <div className="flex items-center space-x-4">
  //         <div className="text-lg font-semibold">Score: {gameState.score}</div>
  //         <div className="text-lg font-semibold">
  //           Time: {gameState.timeRemaining}s
  //         </div>
  //       </div>
  //     </div>

  //     {/* Game Area */}
  //     <div className="flex-1 flex flex-col items-center justify-center p-4">
  //       {React.cloneElement(children as React.ReactElement, {
  //         ...gameControls,
  //       })}
  //     </div>

  //     {/* Status Message */}
  //     <div className="p-4 bg-black bg-opacity-20 text-center">
  //       <p className="text-lg">{gameState.message}</p>
  //       {gameState.status === "playing" && (
  //         <div className="mt-2">
  //           <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
  //             <div
  //               className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
  //               style={{
  //                 width: `${(gameState.timeRemaining / duration) * 100}%`,
  //               }}
  //             />
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
