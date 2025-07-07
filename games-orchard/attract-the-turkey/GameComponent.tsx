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

function AttractTheTurkeyGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [turkeyPosition, setTurkeyPosition] = useState(80); // Start far away
  const [turkeyMood, setTurkeyMood] = useState<'shy' | 'curious' | 'approaching' | 'close'>('shy');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game once
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle game setup
  useEffect(() => {
    if (isInitialized) {
      updateMessage?.('There\'s a shy turkey in the distance. Make turkey sounds to attract it!');
      if (sendVoiceMessage) {
        sendVoiceMessage('Look! There\'s a beautiful turkey way over there, but it\'s very shy. You need to make turkey sounds to get its attention and call it over. Try gobbling, clucking, or making turkey noises!');
      }
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  const handleTurkeyCall = () => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    setTurkeyMood('close');
    
    updateMessage?.('Success! The turkey came right up to you!');
    
    if (playSound) {
      playSound('turkey-gobble');
    }
    
    if (sendVoiceMessage) {
      sendVoiceMessage('Wonderful! Your turkey sounds were so convincing that the turkey came right over! It\'s now gobbling happily beside you!');
    }
    
    const score = 85; // Default good score
    endGame?.(true, 'Turkey whisperer! You attracted the turkey!', score);
  };

  const getTurkeyEmoji = () => {
    switch (turkeyMood) {
      case 'shy': return '🦃';
      case 'curious': return '🦃';
      case 'approaching': return '🦃';
      case 'close': return '🦃';
      default: return '🦃';
    }
  };

  const getTurkeySize = () => {
    return turkeyPosition > 60 ? 'text-2xl' : turkeyPosition > 30 ? 'text-4xl' : 'text-6xl';
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-orange-200 via-yellow-200 to-green-300 overflow-hidden">
      {/* Fall forest background */}
      <div className="absolute inset-0">
        {/* Trees */}
        <div className="absolute bottom-0 left-10 text-6xl opacity-60">🌳</div>
        <div className="absolute bottom-0 right-20 text-5xl opacity-50">🌲</div>
        <div className="absolute bottom-0 left-1/3 text-4xl opacity-40">🌳</div>
        <div className="absolute bottom-0 right-1/3 text-5xl opacity-55">🌲</div>
        
        {/* Autumn leaves */}
        <div className="absolute top-10 left-16 text-2xl animate-fall">🍂</div>
        <div className="absolute top-8 right-24 text-xl animate-fall-delayed">🍁</div>
        <div className="absolute top-12 left-2/3 text-2xl animate-fall">🍂</div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-amber-600 to-amber-400">
        {/* Scattered leaves on ground */}
        <div className="absolute top-2 left-1/4 text-xl">🍂</div>
        <div className="absolute top-1 right-1/3 text-lg">🍁</div>
        <div className="absolute top-3 left-2/3 text-xl">🍂</div>
      </div>

      {/* Turkey */}
      <div 
        className={`absolute bottom-16 transition-all duration-1000 ${getTurkeySize()}`}
        style={{ 
          right: `${turkeyPosition}%`,
          transform: `translateX(50%) ${turkeyMood === 'approaching' ? 'scale(1.1)' : 'scale(1)'}`,
        }}
      >
        <div className={`${turkeyMood === 'curious' ? 'animate-bounce' : turkeyMood === 'approaching' ? 'animate-waddle' : ''}`}>
          {getTurkeyEmoji()}
        </div>
        
        {/* Turkey mood indicator */}
        <div className="text-xs text-center bg-brown-600 bg-opacity-70 text-white rounded px-2 py-1 mt-1">
          {turkeyMood.toUpperCase()}
        </div>
      </div>

      {/* Player */}
      <div className="absolute bottom-16 left-8">
        <div className="text-4xl">🚶‍♂️</div>
        <div className="text-xs text-center bg-black bg-opacity-50 text-white rounded px-2 py-1 mt-1">
          YOU
        </div>
      </div>

      {/* Distance indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <div className="text-sm font-bold mb-2">Turkey Distance</div>
        <div className="w-32 h-4 bg-gray-700 rounded">
          <div 
            className="h-full bg-orange-500 rounded transition-all duration-1000"
            style={{ width: `${100 - turkeyPosition}%` }}
          ></div>
        </div>
        <div className="text-xs mt-1">
          {turkeyPosition > 70 ? 'Very Far' : turkeyPosition > 40 ? 'Getting Closer' : turkeyPosition > 20 ? 'Almost Here' : 'Very Close!'}
        </div>
      </div>

      {/* Instructions */}
      {!hasAnswered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center max-w-md">
          <p className="text-lg font-bold">🦃 Make turkey sounds!</p>
          <p className="text-sm">Click to call the turkey over</p>
          <button 
            onClick={handleTurkeyCall}
            className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold"
          >
            Gobble Gobble!
          </button>
        </div>
      )}

      {/* Sound effects visualization */}
      {turkeyMood !== 'shy' && (
        <div className="absolute left-20 bottom-32">
          <div className="text-2xl animate-pulse">💨</div>
          <div className="text-sm bg-yellow-400 text-black rounded px-2 py-1 mt-1">
            Gobble?
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(20px) rotate(180deg); }
        }
        @keyframes fall-delayed {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(25px) rotate(-180deg); }
        }
        @keyframes waddle {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-fall { animation: fall 4s ease-in infinite; }
        .animate-fall-delayed { animation: fall-delayed 5s ease-in infinite; }
        .animate-waddle { animation: waddle 0.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function AttractTheTurkeyGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Attract The Turkey"
      instructions="Make turkey sounds to call the shy turkey over to you!"
      duration={12}
      {...props}
    >
      <AttractTheTurkeyGame />
    </BaseGame>
  );
}