"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Fish {
  id: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  weight: number;
  emoji: string;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const fishTypes: Fish[] = [
  { id: 'minnow', size: 'small', weight: 1, emoji: '🐟' },
  { id: 'bass', size: 'medium', weight: 3, emoji: '🐠' },
  { id: 'salmon', size: 'large', weight: 8, emoji: '🐟' },
  { id: 'tuna', size: 'huge', weight: 15, emoji: '🐠' },
  { id: 'shark', size: 'huge', weight: 25, emoji: '🦈' },
];

function GoneFishingGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [bobberMovement, setBobberMovement] = useState(0);
  const [bites, setBites] = useState<Fish[]>([]);
  const [currentFish, setCurrentFish] = useState<Fish | null>(null);
  const [isReeling, setIsReeling] = useState(false);
  const [gamePhase, setGamePhase] = useState<'fishing' | 'caught'>('fishing');
  const [waterRipples, setWaterRipples] = useState(0);

  useEffect(() => {
    if (!isInitialized) {
      updateMessage?.('Cast your line! Watch the bobber for bites!');
      if (sendVoiceMessage) {
        sendVoiceMessage('Welcome to the fishing hole! Watch your bobber carefully - when it moves, a fish is biting. The bigger the movement, the bigger the fish!');
      }

      // Generate random fish bites over 8 seconds
      const biteIntervals: NodeJS.Timeout[] = [];
      const biteTimes = [2000, 4500, 6000, 7500]; // 4 potential bites

      biteTimes.forEach((time, index) => {
        const timer = setTimeout(() => {
          const fish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
          setBites(prev => [...prev, fish]);
          setCurrentFish(fish);
          
          // Bobber movement intensity based on fish size
          const movement = fish.weight * 0.3 + Math.random() * 0.2;
          setBobberMovement(movement);
          setWaterRipples(prev => prev + 1);
          
          if (playSound) {
            playSound('fishing-bite');
          }
          
          updateMessage?.(`Bite detected! ${fish.size.toUpperCase()} movement detected!`);
          
          // Reset bobber after 1 second
          setTimeout(() => {
            setBobberMovement(0);
            setCurrentFish(null);
          }, 1000);
        }, time);
        
        biteIntervals.push(timer);
      });

      // End fishing phase after 8 seconds
      const endTimer = setTimeout(() => {
        setGamePhase('caught');
        if (bites.length > 0) {
          const biggestFish = bites.reduce((prev, current) => 
            prev.weight > current.weight ? prev : current
          );
          
          updateMessage?.(`Time to see what you caught! Biggest fish: ${biggestFish.size} ${biggestFish.emoji}`);
          if (sendVoiceMessage) {
            sendVoiceMessage(`Fishing time is up! Let's see what you caught. Your biggest fish was a ${biggestFish.size} ${biggestFish.id} weighing ${biggestFish.weight} pounds!`);
          }
          
          // Success based on biggest fish caught
          const score = biggestFish.weight * 10;
          const success = biggestFish.weight >= 8; // Large or huge fish
          
          setTimeout(() => {
            endGame?.(success, `You caught a ${biggestFish.size} ${biggestFish.id}! (${biggestFish.weight}lbs)`, score);
          }, 2000);
        } else {
          updateMessage?.('No fish caught today...');
          if (sendVoiceMessage) {
            sendVoiceMessage('Unfortunately, no fish took the bait today. Better luck next time!');
          }
          setTimeout(() => {
            endGame?.(false, 'The fish weren\'t biting today!', 0);
          }, 2000);
        }
      }, 8000);

      setIsInitialized(true);
      return () => {
        biteIntervals.forEach(clearTimeout);
        clearTimeout(endTimer);
      };
    }
  }, [isInitialized, updateMessage, sendVoiceMessage, playSound]);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-sky-300 to-blue-600">
      {/* Sky and clouds */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-sky-200 to-sky-400">
        <div className="text-4xl absolute top-4 left-10 animate-float">☁️</div>
        <div className="text-3xl absolute top-8 right-20 animate-float-delayed">☁️</div>
        <div className="text-2xl absolute top-12 left-1/3 animate-float">☁️</div>
      </div>

      {/* Water surface */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-b from-blue-400 to-blue-800 relative overflow-hidden">
        {/* Water ripples */}
        {Array.from({ length: waterRipples }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white border-opacity-30 animate-ping"
            style={{
              left: '50%',
              top: '30%',
              width: `${(i + 1) * 40}px`,
              height: `${(i + 1) * 40}px`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Fishing line */}
        <div className="absolute left-1/2 top-0 w-0.5 bg-gray-800 h-full transform -translate-x-0.5" />

        {/* Bobber */}
        <div 
          className="absolute left-1/2 bg-red-500 rounded-full w-6 h-6 transform -translate-x-1/2 transition-all duration-200"
          style={{
            top: '30%',
            transform: `translate(-50%, ${bobberMovement * 20}px)`,
            animation: bobberMovement > 0 ? 'bounce 0.3s infinite' : 'none',
          }}
        >
          <div className="absolute inset-0 bg-white rounded-full m-1"></div>
        </div>

        {/* Fish swimming */}
        <div className="absolute bottom-10 left-10 text-3xl animate-swim">🐟</div>
        <div className="absolute bottom-20 right-20 text-2xl animate-swim-reverse">🐠</div>
        <div className="absolute bottom-32 left-1/3 text-4xl animate-swim-slow">🦈</div>

        {/* Bite indicator */}
        {currentFish && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl">{currentFish.emoji}</div>
            <div className="text-center text-white font-bold bg-black bg-opacity-50 rounded px-2 py-1 mt-2">
              {currentFish.size.toUpperCase()} BITE!
            </div>
          </div>
        )}
      </div>

      {/* Fishing rod */}
      <div className="absolute left-10 bottom-20 w-2 h-40 bg-amber-800 transform rotate-45 origin-bottom"></div>

      {/* Caught fish display */}
      {gamePhase === 'caught' && bites.length > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🎣 Catch of the Day!</h3>
            <div className="space-y-2">
              {bites.map((fish, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 rounded p-2">
                  <span className="text-2xl">{fish.emoji}</span>
                  <span className="font-semibold text-gray-700">{fish.id}</span>
                  <span className="text-sm text-gray-600">{fish.weight}lbs</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded">
              <p className="font-bold text-blue-800">
                Biggest: {bites.reduce((prev, current) => prev.weight > current.weight ? prev : current).id}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes swim {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(calc(100vw + 20px)); }
        }
        @keyframes swim-reverse {
          0% { transform: translateX(calc(100vw + 20px)) scaleX(-1); }
          100% { transform: translateX(-20px) scaleX(-1); }
        }
        @keyframes swim-slow {
          0% { transform: translateX(-30px); }
          100% { transform: translateX(calc(100vw + 30px)); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-swim { animation: swim 8s linear infinite; }
        .animate-swim-reverse { animation: swim-reverse 12s linear infinite; }
        .animate-swim-slow { animation: swim-slow 15s linear infinite; }
      `}</style>
    </div>
  );
}

export default function GoneFishingGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Gone Fishing"
      instructions="Watch the bobber carefully! The bigger the movement, the bigger the fish!"
      duration={10}
      {...props}
    >
      <GoneFishingGame />
    </BaseGame>
  );
}