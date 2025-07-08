"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [currentTranscriptionText, setCurrentTranscriptionText] = useState("");
  const [lastCapturedText, setLastCapturedText] = useState("");
  const pttStartTimeRef = useRef<number>(0);
  const [blackScreen, setBlackScreen] = useState(false);
  const [flashWhite, setFlashWhite] = useState(false);
  const [showWinBanner, setShowWinBanner] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

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
      .filter(item => 
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
      console.log("🎮 AdviseTheChild onGameFinish called with result:", result);
      
      // Handle undefined/null results - default to success if no clear failure
      const success = result.success !== undefined ? result.success : true;
      const score = result.score !== undefined ? result.score : 85;
      const message = result.message || "Game completed!";
      
      updateScore?.(score);
      
      // Store results for banner
      setIsWinner(success);
      setFinalScore(score);
      
      // Start black screen effect immediately
      console.log("🖤 STARTING BLACK SCREEN EFFECT");
      setBlackScreen(true);
      
      // Flash white 5 times
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        setFlashWhite(prev => !prev);
        flashCount++;
        if (flashCount >= 10) { // 5 complete flashes (on/off)
          clearInterval(flashInterval);
          // Show banner after flashes
          setTimeout(() => {
            setBlackScreen(false);
            setFlashWhite(false);
            setShowWinBanner(true);
            console.log("🏆 SHOWING WIN BANNER");
            
            // Hide banner and end game after 4 seconds
            setTimeout(() => {
              setShowWinBanner(false);
              endGame?.(success, message, score);
            }, 4000);
          }, 500);
        }
      }, 200);
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
  const handleTalkButtonDown = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isWebRTCReady) return;
    if (isPTTUserSpeaking) return;
    interrupt();
    pttStartTimeRef.current = Date.now(); // Mark when PTT started
    setIsPTTUserSpeaking(true);
    setCurrentTranscriptionText(""); // Clear previous text
    await pushToTalkStartNative();
    console.log("PTT started at:", pttStartTimeRef.current);
  }, [sessionStatus, isWebRTCReady, isPTTUserSpeaking, interrupt, pushToTalkStartNative]);

  const handleTalkButtonUp = useCallback(async () => {
    if (sessionStatus !== "CONNECTED" || !isPTTUserSpeaking) return;
    
    // Save the current transcription text before stopping PTT
    if (currentTranscriptionText.trim()) {
      setLastCapturedText(currentTranscriptionText);
    }
    
    setIsPTTUserSpeaking(false);
    await pushToTalkStopNative();
    console.log("PTT stopped. Final text:", currentTranscriptionText);
  }, [sessionStatus, isPTTUserSpeaking, pushToTalkStopNative, currentTranscriptionText]);

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

        {/* FORCED TRANSCRIPTION DISPLAY - ALWAYS SHOWS */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
          <div className="text-sm text-green-800 font-medium mb-2">
            SPEECH TRANSCRIPTION:
          </div>
          <div className="text-lg text-green-900 bg-white rounded p-2 border border-green-300">
            {isPTTUserSpeaking 
              ? (currentTranscriptionText || "🎤 LISTENING...") 
              : (lastCapturedText || "Press mic button to speak")}
          </div>
          <div className="text-xs text-green-600 mt-2">
            <div>PTT Active: {isPTTUserSpeaking.toString()}</div>
            <div>Current: &quot;{currentTranscriptionText}&quot;</div>
            <div>Last: &quot;{lastCapturedText}&quot;</div>
            <div>Total transcripts: {transcriptItems.length}</div>
            <div>User items only: {transcriptItems.filter(item => item.role === "user").slice(-2).map(item => item.title).filter(Boolean).join(" | ")}</div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="flex justify-center space-x-4 text-2xl opacity-50">
        <span>❤️</span>
        <span>🤗</span>
        <span>💪</span>
        <span>🌟</span>
      </div>

      {/* Black Screen Effect */}
      {blackScreen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: flashWhite ? '#ffffff' : '#000000',
            zIndex: 999999,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Win/Lose Banner */}
      {showWinBanner && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              backgroundColor: isWinner ? '#00ff00' : '#ff0000',
              color: '#000000',
              fontSize: '4rem',
              fontWeight: '900',
              border: '10px solid #000000',
              borderRadius: '20px',
              minWidth: '800px',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px'
            }}
          >
            <div style={{ fontSize: '8rem', marginBottom: '30px' }}>
              {isWinner ? '🏆' : '😢'}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1.2' }}>
              {isWinner ? 'WINNER WINNER' : 'LOSER LOSER'}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1.2' }}>
              {isWinner ? 'CHICKEN DINNER!' : 'CHICKEN HOOSIER!'}
            </div>
            <div style={{ fontSize: '3rem', marginTop: '30px' }}>
              Score: {finalScore}
            </div>
          </div>
        </div>
      )}
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
