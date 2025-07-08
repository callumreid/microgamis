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
}

function PuhLeaseOfficerGame(props: Partial<GameControlProps>) {
  const {
    endGame,
    updateMessage,
    updateScore,
    startTimer,
    sendPlayerText: _sendPlayerText,
    gameState,
  } = props;
  const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [currentTranscriptionText, setCurrentTranscriptionText] = useState("");
  const pttStartTimeRef = useRef<number>(0);
  const [blackScreen, setBlackScreen] = useState(false);
  const [flashWhite, setFlashWhite] = useState(false);
  const [showWinBanner, setShowWinBanner] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showHandcuffs, setShowHandcuffs] = useState(false);

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
    gameType: "puh-lease-officer",
    onGameStart: (scenario: GameScenario) => {
      console.log("Game started with scenario:", scenario);
      updateMessage?.(
        "The police officer is at your door! Listen carefully and convince them to leave!"
      );

      // Start timer after host finishes speaking (estimated 8 seconds for host to speak)
      setTimeout(() => {
        setHostFinishedSpeaking(true);
        startTimer?.();
      }, 8000);
    },
    onGameFinish: (result: GameFinishResult) => {
      console.log("🎮 PuhLeaseOfficer onGameFinish called with result:", result);
      
      // Use the actual result values, don't default success to true
      const success = result.success || false;
      const score = result.score || 0;
      const message = result.message || "Game completed!";
      
      updateScore?.(score);
      
      // Store results for banner
      setIsWinner(success);
      setFinalScore(score);
      
      // If failed, show handcuff drama first!
      if (!success) {
        setShowHandcuffs(true);
        
        // Show handcuffs for 3 seconds, then proceed to normal ending
        setTimeout(() => {
          setShowHandcuffs(false);
          startEndingSequence(success, message, score);
        }, 3000);
      } else {
        // If successful, go straight to normal ending
        startEndingSequence(success, message, score);
      }
    },
  });

  const startEndingSequence = (success: boolean, message: string, score: number) => {
    // Start black screen effect
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
  };

  // Start the game when component mounts (user has already clicked START GAME)
  useEffect(() => {
    updateMessage?.(
      "Welcome to Puh-leeeeeeeease Officer Officer! The AI police officer is preparing to knock on your door..."
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

    setIsPTTUserSpeaking(false);
    await pushToTalkStopNative();
    console.log("PTT stopped. Final text:", currentTranscriptionText);
  }, [
    sessionStatus,
    isPTTUserSpeaking,
    pushToTalkStopNative,
    currentTranscriptionText,
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-red-900 via-gray-800 to-black">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mt-16">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800 p-3 bg-gray-100 rounded-lg">
            Score: {gameState?.score || 0}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            🚔 Puh-leeeeeeeease Officer
          </h2>
          <div className="text-lg font-semibold text-gray-800 p-3 bg-gray-100 rounded-lg">
            Time: {gameState?.timeRemaining || 30}s
          </div>
        </div>
        {/* Speech Bubble - Centered and Prominent */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col justify-center">
          {/* Host Speech Bubble */}
          {latestHost && (
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-red-100 border-2 border-red-300 rounded-2xl rounded-bl-none p-4 max-w-md text-black">
                  <div className="text-sm text-red-800 font-medium mb-1">
                    🚔 Officer:
                  </div>
                  <div className="text-red-900 text-lg">{latestHost}</div>
                </div>
              </div>
            </div>
          )}

          {/* User Speech Bubble */}
          {(latestUser || isPTTUserSpeaking) && (
            <div className="mb-2">
              <div className="flex justify-end">
                <div className="bg-green-100 border-2 border-green-300 rounded-2xl rounded-br-none p-4 max-w-md text-black">
                  <div className="text-sm text-green-800 font-medium mb-1">
                    👤 You:
                  </div>
                  <div className="text-green-900 text-lg">
                    {isPTTUserSpeaking
                      ? currentTranscriptionText || "🎤 Speaking..."
                      : latestUser || "Press mic to speak"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No conversation yet */}
          {!latestHost && !latestUser && !isPTTUserSpeaking && (
            <div className="text-center text-gray-500 text-lg">
              Conversation will appear here...
            </div>
          )}
        </div>
      </div>

      {/* Push-to-Talk Button - Only on Web, Fixed Position */}
      {!Capacitor.isNativePlatform() &&
        hostFinishedSpeaking &&
        sessionStatus === "CONNECTED" &&
        isWebRTCReady && (
          <div className="fixed bottom-6 right-6 z-10">
            <div className="bg-red-50 border-2 border-red-200 rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xs text-red-800 mb-1">Hold to Talk</div>
                <button
                  onMouseDown={handleTalkButtonDown}
                  onMouseUp={handleTalkButtonUp}
                  onMouseLeave={handleTalkButtonUp}
                  onTouchStart={handleTalkButtonDown}
                  onTouchEnd={handleTalkButtonUp}
                  className={`w-16 h-16 rounded-full border-4 border-red-400 transition-all duration-150 ${
                    isPTTUserSpeaking
                      ? "bg-red-500 scale-110 shadow-lg"
                      : "bg-red-200 hover:bg-red-300"
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

      {/* Decorative elements - Smaller */}
      <div className="flex justify-center space-x-3 text-lg opacity-30 mt-4">
        <span>🚨</span>
        <span>⚖️</span>
        <span>🤐</span>
        <span>🏃</span>
      </div>

      {/* Handcuff Drama Screen - Shows before normal ending for failures */}
      {showHandcuffs && (
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
              backgroundColor: '#ff0000',
              color: '#ffffff',
              fontSize: '3rem',
              fontWeight: '900',
              border: '10px solid #ffffff',
              borderRadius: '20px',
              minWidth: '600px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px',
              animation: 'pulse 0.5s infinite'
            }}
          >
            <div style={{ fontSize: '8rem', marginBottom: '30px' }}>
              🔗
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
              "YOU'RE UNDER ARREST!"
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1.2' }}>
              *CLICK* *CLICK*
            </div>
            <div style={{ fontSize: '1.5rem', marginTop: '20px', opacity: '0.9' }}>
              The officer pulls out the handcuffs...
            </div>
          </div>
        </div>
      )}

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
              {isWinner ? '🏆' : '🔗'}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1.2' }}>
              {isWinner ? 'SMOOTH TALKER' : 'HANDCUFFED'}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1.2' }}>
              {isWinner ? 'FREEDOM FIGHTER!' : 'JAIL BIRD SPECIAL!'}
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

export default function PuhLeaseOfficerGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Puh-leeeeeeeease Officer"
      instructions="A police officer will arrive at your door - convince them to leave or face the handcuffs!"
      duration={30}
      {...props}
    >
      <PuhLeaseOfficerGame />
    </BaseGame>
  );
}