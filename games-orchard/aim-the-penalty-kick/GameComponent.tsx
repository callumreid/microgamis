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

type ShotDirection = 'left' | 'center' | 'right';
type GoaliePosition = 'left' | 'center' | 'right';

function AimThePenaltyKickGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [goaliePosition, setGoaliePosition] = useState<GoaliePosition>('center');
  const [hasKicked, setHasKicked] = useState(false);
  const [shotDirection, setShotDirection] = useState<ShotDirection | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Randomly position the goalie
    const positions: GoaliePosition[] = ['left', 'center', 'right'];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    setGoaliePosition(randomPosition);
    
    updateMessage('It\'s penalty time! Where will you aim your shot?');
    if (sendVoiceMessage) {
      sendVoiceMessage('It\'s a penalty kick! The crowd is silent, the goalie is waiting. Where will you aim your shot - left, center, or right side of the goal?');
    }
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasKicked) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        let direction: ShotDirection | null = null;
        
        if (input.includes('left')) {
          direction = 'left';
        } else if (input.includes('right')) {
          direction = 'right';
        } else if (input.includes('center') || input.includes('middle')) {
          direction = 'center';
        }
        
        if (direction) {
          setHasKicked(true);
          setShotDirection(direction);
          
          updateMessage('Taking the shot...');
          
          if (playSound) {
            playSound('soccer-kick');
          }
          
          // Show result after delay
          setTimeout(() => {
            setShowResult(true);
            
            if (direction !== goaliePosition) {
              updateMessage('GOAL! The keeper went the wrong way!');
              if (sendVoiceMessage) {
                sendVoiceMessage(`GOOOOAL! Fantastic shot! You aimed ${direction} and the goalkeeper dived ${goaliePosition}! The crowd goes wild!`);
              }
              
              if (playSound) {
                playSound('soccer-goal');
              }
              
              setTimeout(() => {
                endGame(true, `Perfect penalty! Scored by shooting ${direction}!`, 100);
              }, 2000);
            } else {
              updateMessage('Saved! The goalkeeper guessed correctly!');
              if (sendVoiceMessage) {
                sendVoiceMessage(`Oh no! The goalkeeper read your mind and saved your ${direction} shot! Better luck next time!`);
              }
              
              setTimeout(() => {
                endGame(false, `Penalty saved! Both you and keeper chose ${direction}`, 0);
              }, 2000);
            }
          }, 1500);
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasKicked, goaliePosition, endGame, updateMessage, sendVoiceMessage, playSound]);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-green-300 to-green-500 overflow-hidden">
      {/* Stadium background */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-400 to-gray-600">
        {/* Crowd */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-800 opacity-60"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 text-xs animate-cheer"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            🧑‍🤝‍🧑
          </div>
        ))}
      </div>

      {/* Goal */}
      <div className="absolute top-1/3 left-1/4 w-1/2 h-32 border-4 border-white bg-gray-100 bg-opacity-20">
        {/* Goal posts */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-white"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white"></div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-white"></div>
        
        {/* Net pattern */}
        <div className="absolute inset-2 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-white" style={{ top: `${i * 12.5}%` }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${i * 8.33}%` }} />
          ))}
        </div>
        
        {/* Goalkeeper */}
        <div 
          className={`absolute text-4xl transition-all duration-300 ${showResult ? 'animate-dive' : 'animate-ready'}`}
          style={{
            left: goaliePosition === 'left' ? '10%' : goaliePosition === 'right' ? '80%' : '45%',
            bottom: '5px',
            transform: showResult && shotDirection !== goaliePosition ? 'translateX(-50px)' : 'none',
          }}
        >
          🥅
        </div>
      </div>

      {/* Soccer ball */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
        <div className={`text-4xl ${hasKicked ? 'animate-kick' : 'animate-bounce'}`}>
          ⚽
        </div>
        <div className="text-xs text-center bg-white bg-opacity-70 rounded px-2 py-1 mt-1">
          PENALTY SPOT
        </div>
      </div>

      {/* Shot direction indicators */}
      {!hasKicked && (
        <div className="absolute top-1/2 left-1/4 w-1/2 flex justify-between text-2xl opacity-60">
          <div className="text-center">
            <div>⬅️</div>
            <div className="text-xs text-white font-bold">LEFT</div>
          </div>
          <div className="text-center">
            <div>⬆️</div>
            <div className="text-xs text-white font-bold">CENTER</div>
          </div>
          <div className="text-center">
            <div>➡️</div>
            <div className="text-xs text-white font-bold">RIGHT</div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!hasKicked && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center">
          <p className="text-lg font-bold">🎤 Choose your shot direction!</p>
          <p className="text-sm">Say "left", "center", or "right"</p>
        </div>
      )}

      {/* Result overlay */}
      {showResult && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-md">
            <div className="text-6xl mb-4">
              {shotDirection !== goaliePosition ? '⚽🥅' : '🥅✋'}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {shotDirection !== goaliePosition ? 'GOAL!' : 'SAVED!'}
            </h3>
            <p className="text-gray-600">
              You shot {shotDirection}, keeper went {goaliePosition}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes cheer {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes ready {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes dive {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px) rotate(45deg); }
        }
        @keyframes kick {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-30px) scale(0.8); }
          100% { transform: translateY(-60px) scale(0.6); }
        }
        .animate-cheer { animation: cheer 2s ease-in-out infinite; }
        .animate-ready { animation: ready 1s ease-in-out infinite; }
        .animate-dive { animation: dive 0.5s ease-out; }
        .animate-kick { animation: kick 1s ease-out; }
      `}</style>
    </div>
  );
}

export default function AimThePenaltyKickGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Aim The Penalty Kick"
      instructions="Choose where to aim your penalty shot - avoid the goalkeeper!"
      duration={10}
      {...props}
    >
      <AimThePenaltyKickGame />
    </BaseGame>
  );
}