"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const directions = ['port', 'starboard'];
const icebergPositions = ['left', 'right', 'center'];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function SteerShipGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [icebergPosition, setIcebergPosition] = useState('');
  const [correctDirection, setCorrectDirection] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showIceberg, setShowIceberg] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const position = icebergPositions[Math.floor(Math.random() * icebergPositions.length)];
    setIcebergPosition(position);
    
    // Determine correct steering
    let correct = '';
    if (position === 'left') correct = 'starboard'; // Steer right to avoid left iceberg
    else if (position === 'right') correct = 'port'; // Steer left to avoid right iceberg  
    else correct = directions[Math.floor(Math.random() * directions.length)]; // Center - either works
    
    setCorrectDirection(correct);
    updateMessage('Captain! Iceberg ahead!');
    
    setTimeout(() => {
      setShowIceberg(true);
      updateMessage('ICEBERG SPOTTED! Quick - steer the ship!');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(`ICEBERG DEAD AHEAD! Captain, we need to steer ${correct === 'port' ? 'to port' : 'to starboard'} immediately! Say "port" or "starboard"!`);
      }
      
      if (playSound) {
        playSound('ship-horn');
      }
    }, 2000);
  }, [updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (showIceberg && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showIceberg && countdown === 0 && !hasAnswered) {
      // Time's up!
      setHasAnswered(true);
      updateMessage('Too late! The Titanic strikes the iceberg!');
      if (sendVoiceMessage) {
        sendVoiceMessage('*CRASH* The ship has struck the iceberg! All hands on deck!');
      }
      endGame(false, 'Too slow! The ship sank just like the real Titanic.', 0);
    }
  }, [showIceberg, countdown, hasAnswered, updateMessage, sendVoiceMessage, endGame]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showIceberg) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.includes('port') || input.includes('starboard')) {
          setHasAnswered(true);
          
          const userDirection = input.includes('port') ? 'port' : 'starboard';
          
          if (icebergPosition === 'center' || userDirection === correctDirection) {
            updateMessage('Excellent navigation! The ship narrowly avoids the iceberg!');
            if (sendVoiceMessage) {
              sendVoiceMessage('Brilliant steering, Captain! The ship passes safely by the iceberg. All passengers are safe!');
            }
            endGame(true, 'Ship saved! You\'re a true captain!', 100);
          } else {
            updateMessage('Wrong direction! The ship scrapes the iceberg!');
            if (sendVoiceMessage) {
              sendVoiceMessage('*SCRAPING NOISE* The ship grazes the iceberg! We\'re taking on water but staying afloat!');
            }
            endGame(false, `Should have steered ${correctDirection}! Close call.`, 30);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showIceberg, correctDirection, icebergPosition, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showIceberg ? (
        <div className="text-center">
          <div className="text-8xl">🚢</div>
          <p className="text-2xl mt-4 animate-pulse">*Sailing through icy waters*</p>
          <div className="text-4xl mt-4">🌊</div>
        </div>
      ) : (
        <>
          <div className="bg-blue-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-blue-400">
            <div className="text-6xl mb-4">🚢</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-200">RMS TITANIC - BRIDGE</h3>
            <div className="relative bg-black bg-opacity-50 rounded p-4 mb-4">
              <div className="flex justify-center items-center space-x-4">
                {icebergPosition === 'left' && <div className="text-4xl">🧊</div>}
                <div className="text-3xl">🚢</div>
                {icebergPosition === 'center' && <div className="text-4xl">🧊</div>}
                {icebergPosition === 'right' && <div className="text-4xl">🧊</div>}
              </div>
            </div>
            <div className="text-red-400 font-bold text-xl">
              ⚠️ COLLISION IN {countdown} SECONDS! ⚠️
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Say "PORT" (left) or "STARBOARD" (right)!
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Port = Left | Starboard = Right</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>The ship responds to your command...</p>
              <div className="text-4xl animate-spin mt-2">⚓</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SteerShipGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Steer the Ship"
      instructions="You're piloting the Titanic! Avoid the iceberg with quick navigation commands!"
      duration={8}
      {...props}
    >
      <SteerShipGame />
    </BaseGame>
  );
}