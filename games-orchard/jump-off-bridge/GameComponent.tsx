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

function JumpOffBridgeGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [peopleJumping, setPeopleJumping] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [crowdPressure, setCrowdPressure] = useState(0);

  useEffect(() => {
    if (!isInitialized) {
      updateMessage?.('Everyone is jumping off this bridge! What do you do?');
      if (sendVoiceMessage) {
        sendVoiceMessage('You find yourself at a bridge where everyone seems to be jumping off! There\'s a crowd gathering and peer pressure mounting. What\'s your choice - will you jump or not jump?');
      }

      // Gradually increase people jumping and pressure
      const pressureTimer = setInterval(() => {
        setPeopleJumping(prev => Math.min(prev + 1, 15));
        setCrowdPressure(prev => Math.min(prev + 1, 100));
      }, 300);

      setIsInitialized(true);
      return () => clearInterval(pressureTimer);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && isInitialized) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        setHasAnswered(true);
        
        const jumpKeywords = ['jump', 'leap', 'yes', 'do it', 'go for it', 'why not'];
        const noJumpKeywords = ['no', 'don\'t', 'won\'t', 'refuse', 'never', 'not jumping'];
        
        const wantsToJump = jumpKeywords.some(keyword => input.includes(keyword));
        const doesntWantToJump = noJumpKeywords.some(keyword => input.includes(keyword));
        
        // This game is designed so you lose no matter what (follower or maniac)
        if (wantsToJump) {
          updateMessage?.('You jumped! You\'re just following the crowd like a sheep!');
          if (sendVoiceMessage) {
            sendVoiceMessage('Oh no! You jumped off the bridge! You\'re just a follower, doing whatever everyone else does. That\'s not thinking for yourself!');
          }
          endGame?.(false, 'Follower! You just did what everyone else was doing!', 0);
        } else if (doesntWantToJump) {
          updateMessage?.('You didn\'t jump! But now you\'re the weird one who won\'t join in!');
          if (sendVoiceMessage) {
            sendVoiceMessage('You refused to jump! But now everyone thinks you\'re a party pooper who won\'t participate in group activities. You can\'t win!');
          }
          endGame?.(false, 'Party pooper! You won\'t join in the fun!', 0);
        } else {
          // Default to the "thinking too much" ending
          updateMessage?.('While you hesitated, everyone else jumped! You missed out!');
          if (sendVoiceMessage) {
            sendVoiceMessage('You thought too long about it! While you were deliberating, everyone else already jumped and now you\'re left behind. Analysis paralysis!');
          }
          endGame?.(false, 'Overthinker! You missed the moment!', 0);
        }
      };
      
      // Voice input removed for build compatibility
    }
  }, [onVoiceInput, hasAnswered, isInitialized]);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-blue-300 to-green-400">
      {/* Bridge */}
      <div className="absolute top-1/3 left-0 right-0 h-16 bg-gray-600 border-t-4 border-b-4 border-gray-800">
        {/* Bridge railings */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-700"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700"></div>
        
        {/* Bridge supports */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-1 bg-gray-800"
            style={{ left: `${i * 12.5}%` }}
          />
        ))}
      </div>

      {/* People jumping */}
      <div className="absolute top-1/2 left-0 right-0">
        {Array.from({ length: peopleJumping }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-fall"
            style={{
              left: `${10 + i * 5}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s',
            }}
          >
            🤸‍♂️
          </div>
        ))}
      </div>

      {/* Crowd on bridge */}
      <div className="absolute top-1/4 left-0 right-0 flex justify-center">
        {Array.from({ length: Math.max(0, 8 - peopleJumping) }).map((_, i) => (
          <div key={i} className="text-3xl mx-1">
            🧍‍♂️
          </div>
        ))}
      </div>

      {/* You (the player) */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="text-4xl">🫵</div>
        <div className="text-xs text-center bg-yellow-400 text-black rounded px-2 py-1 mt-1 font-bold">
          YOU
        </div>
      </div>

      {/* Crowd pressure meter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <div className="text-sm font-bold mb-2">Peer Pressure</div>
        <div className="w-32 h-4 bg-gray-700 rounded">
          <div 
            className="h-full bg-red-500 rounded transition-all duration-300"
            style={{ width: `${crowdPressure}%` }}
          ></div>
        </div>
        <div className="text-xs mt-1">
          {crowdPressure < 30 ? 'Mild' : crowdPressure < 70 ? 'Strong' : 'INTENSE!'}
        </div>
      </div>

      {/* Crowd chanting */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded max-w-xs">
        <div className="text-sm font-bold mb-2">💬 The Crowd Says:</div>
        <div className="text-xs">
          {crowdPressure < 25 ? '"Come on, everyone\'s doing it!"' :
           crowdPressure < 50 ? '"Don\'t be a chicken!"' :
           crowdPressure < 75 ? '"Just jump already!"' :
           '"JUMP! JUMP! JUMP!"'}
        </div>
      </div>

      {/* Decision prompt */}
      {!hasAnswered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black p-4 rounded-lg text-center border-4 border-yellow-600">
          <p className="text-lg font-bold">🎤 What do you do?</p>
          <p className="text-sm">Will you jump off the bridge like everyone else?</p>
          <p className="text-xs mt-2 opacity-75">Say "jump" or "don't jump"</p>
        </div>
      )}

      {/* Water/ground below */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-600 to-blue-400">
        {/* Splash effects where people land */}
        {Array.from({ length: Math.min(peopleJumping, 5) }).map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-splash"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '10px',
              animationDelay: `${i * 0.4}s`,
            }}
          >
            💦
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(200px) rotate(360deg); }
        }
        @keyframes splash {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-fall { animation: fall 2s ease-in infinite; }
        .animate-splash { animation: splash 1s ease-out infinite; }
      `}</style>
    </div>
  );
}

export default function JumpOffBridgeGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Jump Off Bridge"
      instructions="Everyone is jumping off this bridge! What will you do?"
      duration={10}
      {...props}
    >
      <JumpOffBridgeGame />
    </BaseGame>
  );
}