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

function HowManyCowsGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [actualCowCount, setActualCowCount] = useState(0);
  const [cowsVisible, setCowsVisible] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [stampeding, setStampeding] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      // Generate random number of cows (8-20)
      const count = 8 + Math.floor(Math.random() * 13);
      setActualCowCount(count);
      
      updateMessage?.('Count the cows in the stampede!');
      if (sendVoiceMessage) {
        sendVoiceMessage(`Yeehaw! There's a cattle stampede coming through! Count how many cows you see running past, then tell me the number when they're gone!`);
      }

      if (playSound) {
        playSound('cow-stampede');
      }

      // Hide cows after 6 seconds
      const hideTimer = setTimeout(() => {
        setCowsVisible(false);
        setStampeding(false);
        updateMessage?.('The stampede has passed! How many cows did you count?');
        if (sendVoiceMessage) {
          sendVoiceMessage('The dust has settled! How many cows did you count in that stampede? Tell me the number!');
        }
      }, 6000);

      setIsInitialized(true);
      return () => clearTimeout(hideTimer);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && !cowsVisible && isInitialized) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        // Extract number from speech
        const numbers = input.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const guessedCount = parseInt(numbers[0]);
          setHasAnswered(true);
          
          const difference = Math.abs(guessedCount - actualCowCount);
          const accuracy = Math.max(0, 100 - (difference * 10));
          
          if (difference === 0) {
            updateMessage?.(`Perfect! There were exactly ${actualCowCount} cows!`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Incredible! You counted exactly right - there were ${actualCowCount} cows in that stampede! You've got the eye of a true cowboy!`);
            }
            endGame?.(true, `Bull's eye! Exactly ${actualCowCount} cows!`, 100);
          } else if (difference <= 2) {
            updateMessage?.(`Very close! There were ${actualCowCount} cows, you guessed ${guessedCount}.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Great counting! You were very close - there were ${actualCowCount} cows and you guessed ${guessedCount}. That's some fine cattle counting!`);
            }
            endGame?.(true, `Close enough! Off by ${difference}`, accuracy);
          } else if (difference <= 5) {
            updateMessage?.(`Not bad! There were ${actualCowCount} cows, you guessed ${guessedCount}.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Decent counting in that dust cloud! The actual count was ${actualCowCount} cows, you guessed ${guessedCount}. Keep practicing your cattle counting!`);
            }
            endGame?.(true, `Pretty good! Off by ${difference}`, accuracy);
          } else {
            updateMessage?.(`Way off! There were ${actualCowCount} cows, you guessed ${guessedCount}.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Whoa there, partner! You were quite a bit off - there were ${actualCowCount} cows but you guessed ${guessedCount}. That stampede was pretty chaotic!`);
            }
            endGame?.(false, `Too far off! Difference of ${difference}`, Math.max(10, accuracy));
          }
        }
      };
      
      // Voice input removed for build compatibility
    }
  }, [onVoiceInput, hasAnswered, cowsVisible, actualCowCount, isInitialized]);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-amber-200 to-green-300 overflow-hidden">
      {/* Sky and clouds */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-300 to-amber-200">
        <div className="absolute top-4 left-20 text-4xl opacity-70 animate-float">☁️</div>
        <div className="absolute top-8 right-10 text-3xl opacity-50 animate-float-delayed">☁️</div>
        <div className="absolute top-12 left-1/2 text-2xl opacity-60 animate-float">☁️</div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-green-400 to-green-300">
        {/* Grass texture */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-green-500 opacity-30"></div>
      </div>

      {/* Fence */}
      <div className="absolute bottom-20 left-0 w-full h-1 bg-amber-800"></div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-16 w-1 h-12 bg-amber-800"
          style={{ left: `${i * 8.33}%` }}
        />
      ))}

      {/* Cows stampeding */}
      {cowsVisible && (
        <>
          {Array.from({ length: actualCowCount }).map((_, i) => (
            <div
              key={i}
              className={`absolute text-4xl ${stampeding ? 'animate-stampede' : ''}`}
              style={{
                left: `${-10 + (i * 15)}%`,
                bottom: `${25 + (i % 3) * 15}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              🐄
            </div>
          ))}
          
          {/* Dust clouds */}
          <div className="absolute bottom-10 left-0 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl opacity-60 animate-dust"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                💨
              </div>
            ))}
          </div>
        </>
      )}

      {/* Counter display for player reference */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <div className="text-lg font-bold">🤠 Cattle Count</div>
        <div className="text-sm">
          {cowsVisible ? 'Stampede in progress...' : 'Make your guess!'}
        </div>
      </div>

      {/* Dust settling message */}
      {!cowsVisible && !hasAnswered && (
        <div className="absolute inset-0 bg-amber-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              The stampede has passed!
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              How many cows did you count?
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
              <p className="text-md font-semibold text-yellow-800">
                🎤 Say the number you counted!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ranch decorations */}
      <div className="absolute bottom-8 right-8 text-3xl">🏠</div>
      <div className="absolute bottom-12 left-8 text-2xl">🌾</div>

      <style jsx>{`
        @keyframes stampede {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(calc(100vw + 50px)); }
        }
        @keyframes dust {
          0% { transform: translateX(0px) scale(0.5); opacity: 0.8; }
          50% { transform: translateX(30px) scale(1); opacity: 0.4; }
          100% { transform: translateX(60px) scale(1.5); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-stampede { animation: stampede linear infinite; }
        .animate-dust { animation: dust 3s ease-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function HowManyCowsGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="How Many Cows?"
      instructions="Count the cows in the stampede and remember the number!"
      duration={10}
      {...props}
    >
      <HowManyCowsGame />
    </BaseGame>
  );
}