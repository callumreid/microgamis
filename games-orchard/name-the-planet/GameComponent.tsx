"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Planet {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size: string;
  hint: string;
  description: string;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const planets: Planet[] = [
  { id: 'mercury', name: 'mercury', emoji: '☿️', color: 'from-gray-400 to-gray-600', size: 'text-4xl', hint: 'Closest to the Sun', description: 'The smallest and closest planet to our star' },
  { id: 'venus', name: 'venus', emoji: '♀️', color: 'from-yellow-300 to-orange-400', size: 'text-5xl', hint: 'Hottest planet', description: 'Known for its thick, toxic atmosphere' },
  { id: 'earth', name: 'earth', emoji: '🌍', color: 'from-blue-400 to-green-400', size: 'text-5xl', hint: 'Our home planet', description: 'The only known planet with life' },
  { id: 'mars', name: 'mars', emoji: '♂️', color: 'from-red-400 to-red-600', size: 'text-5xl', hint: 'The Red Planet', description: 'Named after the Roman god of war' },
  { id: 'jupiter', name: 'jupiter', emoji: '♃', color: 'from-orange-300 to-yellow-600', size: 'text-8xl', hint: 'Largest planet', description: 'A gas giant with the Great Red Spot' },
  { id: 'saturn', name: 'saturn', emoji: '♄', color: 'from-yellow-200 to-amber-400', size: 'text-7xl', hint: 'Has prominent rings', description: 'Famous for its beautiful ring system' },
  { id: 'uranus', name: 'uranus', emoji: '♅', color: 'from-cyan-300 to-blue-400', size: 'text-6xl', hint: 'Tilted on its side', description: 'An ice giant that rotates on its side' },
  { id: 'neptune', name: 'neptune', emoji: '♆', color: 'from-blue-500 to-blue-700', size: 'text-6xl', hint: 'Farthest from Sun', description: 'The windiest planet in our solar system' },
];

function NameThePlanetGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Select random planet
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    setCurrentPlanet(randomPlanet);
    
    updateMessage('Which planet is this?');
    if (sendVoiceMessage) {
      sendVoiceMessage(`Welcome to space exploration! I'm showing you a planet from our solar system. Study its appearance carefully and tell me which planet this is!`);
    }

    // Planet rotation animation
    const rotationTimer = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    // Show hint after 5 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      updateMessage(`Hint: ${randomPlanet.hint}`);
      if (sendVoiceMessage) {
        sendVoiceMessage(`Here's a hint to help you: ${randomPlanet.hint}`);
      }
    }, 5000);

    return () => {
      clearInterval(rotationTimer);
      clearTimeout(hintTimer);
    };
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentPlanet) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        const correctPlanet = currentPlanet.name.toLowerCase();
        
        // Check if the answer contains the correct planet name
        if (input.includes(correctPlanet)) {
          setHasAnswered(true);
          updateMessage(`Correct! This is ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}!`);
          
          if (playSound) {
            playSound('space-success');
          }
          
          if (sendVoiceMessage) {
            sendVoiceMessage(`Excellent work, space explorer! You correctly identified ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}! ${currentPlanet.description}`);
          }
          
          const score = showHint ? 75 : 100; // Less points if hint was shown
          endGame(true, `Space expert! ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)} is correct!`, score);
        } else {
          // Check if they named another planet
          const otherPlanets = planets.filter(p => p.id !== currentPlanet.id);
          const mentionedOtherPlanet = otherPlanets.some(planet => input.includes(planet.name));
          
          setHasAnswered(true);
          
          if (mentionedOtherPlanet) {
            updateMessage(`Not quite! This is ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}, not what you said.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Close guess, but this is actually ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}! ${currentPlanet.description}`);
            }
          } else {
            updateMessage(`Sorry, that's not right. This is ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Not quite right. This planet is ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}. ${currentPlanet.description}`);
            }
          }
          
          endGame(false, `This planet is ${currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1)}`, 0);
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, currentPlanet, showHint, endGame, updateMessage, sendVoiceMessage, playSound]);

  if (!currentPlanet) {
    return <div>Loading solar system...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-lg p-8 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-black bg-opacity-50 rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-white">🚀 Name The Planet!</h2>
        
        {/* Planet display */}
        <div className="flex justify-center mb-6">
          <div
            className={`rounded-full bg-gradient-to-br ${currentPlanet.color} shadow-2xl relative ${currentPlanet.size} w-32 h-32 flex items-center justify-center`}
            style={{
              transform: `rotate(${rotation}deg)`,
              boxShadow: '0 0 50px rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="text-4xl">{currentPlanet.emoji}</div>
            
            {/* Planet-specific features */}
            {currentPlanet.id === 'saturn' && (
              <>
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-full opacity-60" style={{ transform: 'scaleX(1.8) scaleY(0.3)' }}></div>
                <div className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-40" style={{ transform: 'scaleX(2.2) scaleY(0.4)' }}></div>
              </>
            )}
            
            {currentPlanet.id === 'jupiter' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30 rounded-full"></div>
            )}
          </div>
        </div>

        <div className="text-lg text-gray-300 mb-4">
          Study this celestial body carefully...
        </div>

        {/* Hint section */}
        {showHint && (
          <div className="bg-blue-900 bg-opacity-70 border border-blue-400 rounded-lg p-4 mb-4">
            <div className="text-2xl mb-2">💫</div>
            <p className="text-lg font-semibold text-blue-200">Hint: {currentPlanet.hint}</p>
          </div>
        )}

        {/* Voice input prompt */}
        <div className="bg-purple-800 bg-opacity-50 border border-purple-400 rounded-lg p-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="text-lg font-semibold text-purple-200">
            Speak the name of this planet!
          </p>
          {hasAnswered && (
            <div className="mt-4 text-purple-300">
              <div className="animate-spin text-2xl mb-2">🪐</div>
              <p>Analyzing your answer...</p>
            </div>
          )}
        </div>
      </div>

      {/* Solar system decorations */}
      <div className="relative flex justify-center space-x-2 text-2xl opacity-30">
        <span className="animate-float">🪐</span>
        <span className="animate-float" style={{ animationDelay: '0.5s' }}>🌍</span>
        <span className="animate-float" style={{ animationDelay: '1s' }}>🌕</span>
        <span className="animate-float" style={{ animationDelay: '1.5s' }}>☄️</span>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function NameThePlanetGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Name The Planet"
      instructions="Look at this planet and identify which one it is!"
      duration={10}
      {...props}
    >
      <NameThePlanetGame />
    </BaseGame>
  );
}