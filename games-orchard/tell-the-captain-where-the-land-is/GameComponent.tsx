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

type Direction = 'port' | 'starboard' | 'bow' | 'stern';

const directionInfo = {
  port: { name: 'Port', description: 'Left side of the ship', position: 'left-1/4', emoji: '⬅️' },
  starboard: { name: 'Starboard', description: 'Right side of the ship', position: 'right-1/4', emoji: '➡️' },
  bow: { name: 'Bow', description: 'Front of the ship', position: 'top-1/4', emoji: '⬆️' },
  stern: { name: 'Stern', description: 'Back of the ship', position: 'bottom-1/4', emoji: '⬇️' },
};

function TellTheCaptainGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [landDirection, setLandDirection] = useState<Direction>('port');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [waveAnimation, setWaveAnimation] = useState(0);

  useEffect(() => {
    if (!isInitialized) {
      // Randomly choose where land appears
      const directions: Direction[] = ['port', 'starboard', 'bow', 'stern'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setLandDirection(randomDirection);
      
      updateMessage?.('Ahoy! Look for land and tell the captain where it is!');
      if (sendVoiceMessage) {
        sendVoiceMessage('Ahoy there, sailor! You\'re the lookout on this ship. Scan the horizon and when you spot land, tell the captain which direction it\'s in - port, starboard, bow, or stern!');
      }

      // Wave animation
      const waveTimer = setInterval(() => {
        setWaveAnimation(prev => (prev + 1) % 100);
      }, 100);

      setIsInitialized(true);
      return () => clearInterval(waveTimer);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && isInitialized) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        // Check for naval direction terms
        const directions = {
          port: ['port', 'left'],
          starboard: ['starboard', 'right'],
          bow: ['bow', 'front', 'ahead', 'forward'],
          stern: ['stern', 'back', 'behind', 'rear'],
        };
        
        let detectedDirection: Direction | null = null;
        
        for (const [dir, terms] of Object.entries(directions)) {
          if (terms.some(term => input.includes(term))) {
            detectedDirection = dir as Direction;
            break;
          }
        }
        
        if (detectedDirection) {
          setHasAnswered(true);
          
          if (detectedDirection === landDirection) {
            updateMessage?.(`Excellent seamanship! Land ho to ${directionInfo[landDirection].name}!`);
            
            if (playSound) {
              playSound('ship-bell');
            }
            
            if (sendVoiceMessage) {
              sendVoiceMessage(`Aye aye! Perfect navigation, sailor! You correctly spotted the land to ${directionInfo[landDirection].name} - ${directionInfo[landDirection].description}! The captain is pleased!`);
            }
            
            endGame?.(true, `Great navigation! Land spotted to ${directionInfo[landDirection].name}!`, 100);
          } else {
            updateMessage?.(`Wrong direction! Land was to ${directionInfo[landDirection].name}, not ${directionInfo[detectedDirection].name}!`);
            
            if (sendVoiceMessage) {
              sendVoiceMessage(`Belay that order! You said ${directionInfo[detectedDirection].name}, but the land is actually to ${directionInfo[landDirection].name} - ${directionInfo[landDirection].description}. Back to navigation school!`);
            }
            
            endGame?.(false, `Missed it! Land was to ${directionInfo[landDirection].name}`, 0);
          }
        }
      };
      
      // Voice input removed for build compatibility
    }
  }, [onVoiceInput, hasAnswered, landDirection, isInitialized]);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-sky-300 to-blue-600 overflow-hidden">
      {/* Ocean and waves */}
      <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-blue-400 to-blue-800">
        {/* Animated waves */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-4 bg-blue-300 opacity-60 rounded-full"
              style={{
                width: '200px',
                left: `${(i * 150 + waveAnimation * 2) % window.innerWidth}px`,
                top: `${20 + i * 15 + Math.sin(waveAnimation * 0.1 + i) * 10}px`,
                animation: 'wave 3s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Ship in center */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl relative">
          🚢
          {/* Ship compass */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">
            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
              ⬆️ BOW
            </div>
          </div>
          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-xs text-white font-bold">
            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
              ⬅️ PORT
            </div>
          </div>
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-xs text-white font-bold">
            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
              ➡️ STBD
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">
            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
              ⬇️ STERN
            </div>
          </div>
        </div>
      </div>

      {/* Land in the correct direction */}
      <div className={`absolute ${landDirection === 'port' ? 'left-4 top-1/2 transform -translate-y-1/2' : 
                      landDirection === 'starboard' ? 'right-4 top-1/2 transform -translate-y-1/2' :
                      landDirection === 'bow' ? 'top-4 left-1/2 transform -translate-x-1/2' :
                      'bottom-16 left-1/2 transform -translate-x-1/2'}`}>
        <div className="text-4xl">🏝️</div>
        <div className="text-xs text-white font-bold bg-green-600 bg-opacity-70 rounded px-2 py-1 mt-1">
          LAND HO!
        </div>
      </div>

      {/* Captain's instructions */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-sm">
        <div className="text-2xl mb-2">👨‍✈️ Captain's Orders</div>
        <p className="text-sm">
          "Sailor, keep watch for land! When you spot it, report the direction immediately!"
        </p>
        <div className="mt-2 text-xs opacity-75">
          Port = Left | Starboard = Right<br/>
          Bow = Front | Stern = Back
        </div>
      </div>

      {/* Voice instructions */}
      {!hasAnswered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center">
          <p className="text-lg font-bold">🎤 Shout the direction!</p>
          <p className="text-sm">Say: "Port", "Starboard", "Bow", or "Stern"</p>
        </div>
      )}

      {/* Seagulls */}
      <div className="absolute top-10 right-20 text-2xl animate-fly">🕊️</div>
      <div className="absolute top-16 right-40 text-xl animate-fly-delayed">🕊️</div>

      {/* Clouds */}
      <div className="absolute top-8 left-20 text-4xl opacity-70 animate-float">☁️</div>
      <div className="absolute top-12 right-10 text-3xl opacity-50 animate-float-delayed">☁️</div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(-5px) scaleX(1.1); }
        }
        @keyframes fly {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(10px) translateY(-5px); }
          50% { transform: translateX(0px) translateY(-10px); }
          75% { transform: translateX(-10px) translateY(-5px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes fly-delayed {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(-8px) translateY(-3px); }
          50% { transform: translateX(0px) translateY(-8px); }
          75% { transform: translateX(8px) translateY(-3px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fly { animation: fly 4s ease-in-out infinite; }
        .animate-fly-delayed { animation: fly-delayed 5s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function TellTheCaptainGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Tell The Captain Where The Land Is"
      instructions="Spot the land and report its direction to the captain!"
      duration={10}
      {...props}
    >
      <TellTheCaptainGame />
    </BaseGame>
  );
}