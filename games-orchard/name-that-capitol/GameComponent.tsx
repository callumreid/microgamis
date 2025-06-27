"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Country {
  id: string;
  name: string;
  capital: string;
  flag: string;
  shape: string;
  hint: string;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const countries: Country[] = [
  { id: 'france', name: 'France', capital: 'paris', flag: '🇫🇷', shape: '🥖', hint: 'City of Light' },
  { id: 'italy', name: 'Italy', capital: 'rome', flag: '🇮🇹', shape: '🍕', hint: 'Eternal City' },
  { id: 'japan', name: 'Japan', capital: 'tokyo', flag: '🇯🇵', shape: '🍣', hint: 'Rising Sun' },
  { id: 'germany', name: 'Germany', capital: 'berlin', flag: '🇩🇪', shape: '🍺', hint: 'Once divided city' },
  { id: 'spain', name: 'Spain', capital: 'madrid', flag: '🇪🇸', shape: '🥘', hint: 'Royal city' },
  { id: 'uk', name: 'United Kingdom', capital: 'london', flag: '🇬🇧', shape: '☂️', hint: 'Big Ben location' },
  { id: 'russia', name: 'Russia', capital: 'moscow', flag: '🇷🇺', shape: '🏰', hint: 'Red Square' },
  { id: 'china', name: 'China', capital: 'beijing', flag: '🇨🇳', shape: '🥢', hint: 'Forbidden City' },
  { id: 'australia', name: 'Australia', capital: 'canberra', flag: '🇦🇺', shape: '🦘', hint: 'Not Sydney or Melbourne!' },
  { id: 'brazil', name: 'Brazil', capital: 'brasilia', flag: '🇧🇷', shape: '⚽', hint: 'Planned capital city' },
  { id: 'canada', name: 'Canada', capital: 'ottawa', flag: '🇨🇦', shape: '🍁', hint: 'Not Toronto!' },
  { id: 'egypt', name: 'Egypt', capital: 'cairo', flag: '🇪🇬', shape: '🐪', hint: 'Near the pyramids' },
  { id: 'india', name: 'India', capital: 'new delhi', flag: '🇮🇳', shape: '🐘', hint: 'New version of historic city' },
  { id: 'mexico', name: 'Mexico', capital: 'mexico city', flag: '🇲🇽', shape: '🌮', hint: 'Same name as country' },
  { id: 'argentina', name: 'Argentina', capital: 'buenos aires', flag: '🇦🇷', shape: '🥩', hint: 'Good airs' },
];

function NameThatCapitolGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Select random country
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(randomCountry);
    
    updateMessage(`What is the capital of ${randomCountry.name}?`);
    if (sendVoiceMessage) {
      sendVoiceMessage(`Geography time! I'm showing you the flag and shape of ${randomCountry.name}. What is the capital city of this country? Take your time and speak clearly!`);
    }

    // Show hint after 5 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      updateMessage(`Hint: ${randomCountry.hint}`);
      if (sendVoiceMessage) {
        sendVoiceMessage(`Here's a hint: ${randomCountry.hint}`);
      }
    }, 5000);

    return () => clearTimeout(hintTimer);
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentCountry) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        const correctCapital = currentCountry.capital.toLowerCase();
        
        // Check if the answer contains the correct capital
        if (input.includes(correctCapital)) {
          setHasAnswered(true);
          updateMessage(`Correct! The capital of ${currentCountry.name} is ${currentCountry.capital}!`);
          
          if (playSound) {
            playSound('geography-correct');
          }
          
          if (sendVoiceMessage) {
            sendVoiceMessage(`Excellent! You are absolutely right! The capital of ${currentCountry.name} is indeed ${currentCountry.capital}. Well done, geography expert!`);
          }
          
          const score = showHint ? 75 : 100; // Less points if hint was shown
          endGame(true, `Geography master! ${currentCountry.capital} is correct!`, score);
        } else {
          // Check for common wrong answers
          const commonWrongAnswers = [
            'sydney', 'melbourne', 'toronto', 'new york', 'los angeles', 
            'mumbai', 'istanbul', 'zurich', 'milan', 'barcelona'
          ];
          
          const isCommonWrong = commonWrongAnswers.some(wrong => input.includes(wrong));
          
          setHasAnswered(true);
          
          if (isCommonWrong) {
            updateMessage(`Close, but no! The capital is ${currentCountry.capital}, not what you said.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`That's a common misconception! While that city is important, the capital of ${currentCountry.name} is actually ${currentCountry.capital}.`);
            }
          } else {
            updateMessage(`Sorry, that's not right. The capital is ${currentCountry.capital}.`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Not quite right. The correct answer is ${currentCountry.capital}. Geography can be tricky!`);
            }
          }
          
          endGame(false, `The capital of ${currentCountry.name} is ${currentCountry.capital}`, 0);
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, currentCountry, showHint, endGame, updateMessage, sendVoiceMessage, playSound]);

  if (!currentCountry) {
    return <div>Loading geography challenge...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">🌍 Name That Capital!</h2>
        
        {/* Country flag and info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-8xl mb-4">{currentCountry.flag}</div>
          <div className="text-6xl mb-4">{currentCountry.shape}</div>
          <h3 className="text-4xl font-bold text-blue-800 mb-2">{currentCountry.name}</h3>
          <p className="text-lg text-gray-600">What is the capital city?</p>
        </div>

        {/* Hint section */}
        {showHint && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-lg font-semibold text-yellow-800">Hint: {currentCountry.hint}</p>
          </div>
        )}

        {/* Voice input prompt */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="text-lg font-semibold text-blue-800">
            Speak the name of the capital city!
          </p>
          {hasAnswered && (
            <div className="mt-4 text-blue-600">
              <div className="animate-spin text-2xl mb-2">🌐</div>
              <p>Checking your answer...</p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="flex justify-center space-x-4 text-3xl opacity-50">
        <span className="animate-bounce">🗺️</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>📍</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌆</span>
      </div>
    </div>
  );
}

export default function NameThatCapitolGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Name That Capital"
      instructions="Look at the country and name its capital city!"
      duration={10}
      {...props}
    >
      <NameThatCapitolGame />
    </BaseGame>
  );
}