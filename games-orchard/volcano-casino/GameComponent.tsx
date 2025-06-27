"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function VolcanoCasinoGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [playerPosition, setPlayerPosition] = useState(90); // Start far from volcano
  const [volcanoActivity, setVolcanoActivity] = useState(0);
  const [gamePhase, setGamePhase] = useState<'approaching' | 'erupting' | 'ended'>('approaching');
  const [eruptionTime, setEruptionTime] = useState(0);
  const [warningLevel, setWarningLevel] = useState(0);
  const [lavaSpread, setLavaSpread] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Random eruption time between 5-9 seconds
    const eruption = 5000 + Math.random() * 4000;
    setEruptionTime(eruption);
    
    updateMessage('Walk towards the volcano! Say "STOP" when you think it\'s about to erupt!');
    if (sendVoiceMessage) {
      sendVoiceMessage('Welcome to Volcano Casino! Get as close as you can to the smoking volcano, but don\'t get caught in the eruption! Say STOP when you want to stay put!');
    }

    // Gradually increase volcano activity
    const activityTimer = setInterval(() => {
      setVolcanoActivity(prev => Math.min(prev + 0.05, 1));
      setWarningLevel(prev => Math.min(prev + 0.03, 1));
    }, 100);

    // Player automatically approaches
    const moveTimer = setInterval(() => {
      setPlayerPosition(prev => {
        if (prev > 20 && gamePhase === 'approaching' && !hasAnswered) {
          return prev - 0.5; // Move closer to volcano
        }
        return prev;
      });
    }, 100);

    // Eruption
    const eruptionTimer = setTimeout(() => {
      setGamePhase('erupting');
      setLavaSpread(100);
      
      if (playSound) {
        playSound('volcano-eruption');
      }
      
      updateMessage('🌋 ERUPTION! 🌋');
      if (sendVoiceMessage) {
        sendVoiceMessage('KABOOM! The volcano erupts with massive force!');
      }
      
      // Determine if player survived
      setTimeout(() => {
        const safeDistance = 50; // Minimum safe distance
        const survived = playerPosition >= safeDistance;
        const score = Math.max(0, 100 - Math.floor(playerPosition));
        
        if (survived) {
          updateMessage(`Safe! You were ${Math.floor(playerPosition)}% away from the volcano!`);
          if (sendVoiceMessage) {
            sendVoiceMessage(`Congratulations! You kept a safe distance and survived the eruption! You scored ${score} points for your daring approach!`);
          }
          endGame(true, `Survived at ${Math.floor(playerPosition)}% distance!`, score);
        } else {
          updateMessage('💀 You got too close! Melted by lava! 💀');
          if (sendVoiceMessage) {
            sendVoiceMessage('Oh no! You got too close to the volcano and were caught in the lava flow! Better luck next time!');
          }
          endGame(false, 'Melted by the eruption!', 0);
        }
      }, 2000);
    }, eruption);

    return () => {
      clearInterval(activityTimer);
      clearInterval(moveTimer);
      clearTimeout(eruptionTimer);
    };
  }, [updateMessage, sendVoiceMessage, playSound, endGame, gamePhase, hasAnswered, playerPosition]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && gamePhase === 'approaching') {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.includes('stop') || input.includes('wait') || input.includes('hold')) {
          setHasAnswered(true);
          updateMessage('You stopped! Waiting for the eruption...');
          if (sendVoiceMessage) {
            sendVoiceMessage('Smart choice! You\'ve stopped and are waiting to see what happens!');
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, gamePhase, sendVoiceMessage, updateMessage]);

  const getVolcanoEmoji = () => {
    if (gamePhase === 'erupting') return '🌋';
    if (volcanoActivity > 0.7) return '🌋';
    if (volcanoActivity > 0.4) return '🏔️';
    return '⛰️';
  };

  const getSmokeIntensity = () => {
    return Math.floor(volcanoActivity * 10);
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-orange-200 to-red-300 overflow-hidden">
      {/* Background landscape */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-800 to-amber-600"></div>
      
      {/* Volcano */}
      <div className="absolute bottom-0 left-10 flex flex-col items-center">
        <div className="text-8xl mb-2" style={{ filter: gamePhase === 'erupting' ? 'brightness(1.5) saturate(2)' : 'none' }}>
          {getVolcanoEmoji()}
        </div>
        
        {/* Smoke */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          {Array.from({ length: getSmokeIntensity() }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-float opacity-70"
              style={{
                left: `${(i - getSmokeIntensity()/2) * 10}px`,
                top: `${-i * 15}px`,
                animationDelay: `${i * 0.2}s`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            >
              💨
            </div>
          ))}
        </div>
        
        {/* Lava spread */}
        {gamePhase === 'erupting' && (
          <div 
            className="absolute bottom-0 bg-red-600 h-4 rounded-full transition-all duration-1000"
            style={{ 
              width: `${lavaSpread * 8}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Player */}
      <div 
        className="absolute bottom-8 transition-all duration-300"
        style={{ 
          right: `${playerPosition}%`,
          transform: 'translateX(50%)',
        }}
      >
        <div className="text-4xl">🚶‍♂️</div>
        <div className="text-xs text-center bg-black bg-opacity-50 text-white rounded px-1 mt-1">
          {Math.floor(100 - playerPosition)}m
        </div>
      </div>

      {/* Distance meter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <div className="text-sm font-bold">Distance to Volcano</div>
        <div className="text-2xl font-mono">{Math.floor(100 - playerPosition)}m</div>
        <div className="w-32 h-3 bg-gray-700 rounded mt-2">
          <div 
            className="h-full rounded transition-all duration-300"
            style={{ 
              width: `${100 - playerPosition}%`,
              backgroundColor: playerPosition < 30 ? '#ef4444' : playerPosition < 50 ? '#f59e0b' : '#10b981'
            }}
          ></div>
        </div>
      </div>

      {/* Warning system */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <div className="text-sm font-bold">Volcano Activity</div>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full mr-1 ${
                i < warningLevel * 5 ? 
                  (i < 2 ? 'bg-yellow-400' : i < 4 ? 'bg-orange-500' : 'bg-red-500 animate-pulse') :
                  'bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
        {warningLevel > 0.8 && (
          <div className="text-red-400 text-xs mt-1 animate-pulse font-bold">
            CRITICAL!
          </div>
        )}
      </div>

      {/* Eruption overlay */}
      {gamePhase === 'erupting' && (
        <div className="absolute inset-0 bg-red-600 bg-opacity-30 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-8xl animate-bounce">🌋</div>
              <div className="text-4xl font-bold text-white drop-shadow-lg animate-pulse">
                ERUPTION!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {gamePhase === 'approaching' && !hasAnswered && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center">
          <p className="text-lg font-bold">🎤 Say "STOP" when you want to stop moving!</p>
          <p className="text-sm">Get close for points, but don't get caught in the eruption!</p>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float { animation: float 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function VolcanoCasinoGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Volcano Casino"
      instructions="Get as close as you can to the volcano without getting caught in the eruption!"
      duration={12}
      {...props}
    >
      <VolcanoCasinoGame />
    </BaseGame>
  );
}