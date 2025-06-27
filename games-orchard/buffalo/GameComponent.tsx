"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface BuffaloField {
  id: string;
  name: string;
  count: number;
  positions: { x: number; y: number; delay: number }[];
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function BuffaloGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [leftField, setLeftField] = useState<BuffaloField | null>(null);
  const [rightField, setRightField] = useState<BuffaloField | null>(null);
  const [showBuffalo, setShowBuffalo] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [gamePhase, setGamePhase] = useState<'showing' | 'counting' | 'answering'>('showing');

  useEffect(() => {
    // Generate random buffalo counts (3-8 for each field)
    const leftCount = 3 + Math.floor(Math.random() * 6);
    const rightCount = 3 + Math.floor(Math.random() * 6);
    
    // Generate random positions for buffalo
    const generatePositions = (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        x: 10 + Math.random() * 80, // 10-90% of width
        y: 20 + Math.random() * 60, // 20-80% of height  
        delay: i * 200 + Math.random() * 500, // Stagger appearance
      }));
    };

    const left: BuffaloField = {
      id: 'left',
      name: 'Left Field',
      count: leftCount,
      positions: generatePositions(leftCount),
    };

    const right: BuffaloField = {
      id: 'right', 
      name: 'Right Field',
      count: rightCount,
      positions: generatePositions(rightCount),
    };

    setLeftField(left);
    setRightField(right);

    updateMessage('Count the buffalo in each field!');
    if (sendVoiceMessage) {
      sendVoiceMessage('Two fields of buffalo are moving around. Count carefully and tell me which field has more buffalo!');
    }

    // Show buffalo for 6 seconds, then ask for answer
    setTimeout(() => {
      setShowBuffalo(false);
      setGamePhase('answering');
      updateMessage('Which field has more buffalo? Say "left" or "right"');
      if (sendVoiceMessage) {
        sendVoiceMessage('Time to answer! Which field has more buffalo - left or right?');
      }
    }, 6000);
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && gamePhase === 'answering' && leftField && rightField) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.includes('left') || input.includes('right')) {
          setHasAnswered(true);
          
          const correctAnswer = leftField.count > rightField.count ? 'left' : 
                               rightField.count > leftField.count ? 'right' : 'tie';
          
          const userAnswer = input.includes('left') ? 'left' : 'right';
          
          if (userAnswer === correctAnswer) {
            updateMessage(`Correct! ${correctAnswer === 'left' ? 'Left' : 'Right'} field had ${correctAnswer === 'left' ? leftField.count : rightField.count} buffalo!`);
            
            if (playSound) {
              playSound('buffalo-stampede-win');
            }
            
            if (sendVoiceMessage) {
              sendVoiceMessage(`Buffalo stampede! Your buffalo charge across the prairie in victory!`);
            }
            
            endGame(true, `Your buffalo stampede the others! Left: ${leftField.count}, Right: ${rightField.count}`, 100);
          } else {
            updateMessage(`Wrong! ${correctAnswer === 'left' ? 'Left' : 'Right'} field had more buffalo.`);
            
            if (sendVoiceMessage) {
              sendVoiceMessage(`A weeping buffalo begs you to stop being so wrong. Left field had ${leftField.count}, right field had ${rightField.count}.`);
            }
            
            endGame(false, `The buffalo weep at your failure. Left: ${leftField.count}, Right: ${rightField.count}`, 0);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, gamePhase, leftField, rightField, endGame, updateMessage, sendVoiceMessage, playSound]);

  if (!leftField || !rightField) {
    return <div>Loading buffalo...</div>;
  }

  return (
    <div className="w-full h-full relative">
      <div className="flex h-full">
        {/* Left Field */}
        <div className="flex-1 bg-green-400 bg-opacity-30 border-r-2 border-white relative">
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Left Field
          </div>
          {showBuffalo && leftField.positions.map((pos, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                animationDelay: `${pos.delay}ms`,
              }}
            >
              🐃
            </div>
          ))}
        </div>

        {/* Right Field */}
        <div className="flex-1 bg-yellow-400 bg-opacity-30 relative">
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Right Field
          </div>
          {showBuffalo && rightField.positions.map((pos, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                animationDelay: `${pos.delay}ms`,
              }}
            >
              🐃
            </div>
          ))}
        </div>
      </div>

      {/* Overlay messages */}
      {!showBuffalo && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-4">🎤 Which field has more buffalo?</h3>
            <p className="text-xl">Say "left" or "right"</p>
            {hasAnswered && (
              <div className="mt-4 text-yellow-300">
                <p>Counting results...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuffaloGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="BUFFALOOOO"
      instructions="Count the buffalo in each field and say which has more!"
      duration={12}
      {...props}
    >
      <BuffaloGame />
    </BaseGame>
  );
}