"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Pokemon {
  id: string;
  name: string;
  silhouette: string;
  emoji: string;
  type: string;
  hint: string;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const pokemon: Pokemon[] = [
  { id: 'pikachu', name: 'pikachu', silhouette: '⚡', emoji: '⚡🐭', type: 'Electric', hint: 'Yellow mouse Pokemon' },
  { id: 'charizard', name: 'charizard', silhouette: '🔥', emoji: '🔥🐉', type: 'Fire/Flying', hint: 'Dragon-like fire type' },
  { id: 'blastoise', name: 'blastoise', silhouette: '💧', emoji: '💧🐢', type: 'Water', hint: 'Turtle with water cannons' },
  { id: 'venusaur', name: 'venusaur', silhouette: '🌿', emoji: '🌿🦕', type: 'Grass/Poison', hint: 'Large grass type with flower' },
  { id: 'gengar', name: 'gengar', silhouette: '👻', emoji: '👻😈', type: 'Ghost/Poison', hint: 'Mischievous ghost type' },
  { id: 'machamp', name: 'machamp', silhouette: '💪', emoji: '💪👨', type: 'Fighting', hint: 'Four-armed fighter' },
  { id: 'alakazam', name: 'alakazam', silhouette: '🔮', emoji: '🔮🧙', type: 'Psychic', hint: 'Psychic type with spoons' },
  { id: 'gyarados', name: 'gyarados', silhouette: '🐉', emoji: '🐉💧', type: 'Water/Flying', hint: 'Fierce sea serpent' },
  { id: 'snorlax', name: 'snorlax', silhouette: '😴', emoji: '😴🐻', type: 'Normal', hint: 'Very sleepy and large' },
  { id: 'mewtwo', name: 'mewtwo', silhouette: '🧬', emoji: '🧬👽', type: 'Psychic', hint: 'Legendary psychic type' },
  { id: 'jigglypuff', name: 'jigglypuff', silhouette: '🎵', emoji: '🎵🎤', type: 'Normal/Fairy', hint: 'Sings lullabies' },
  { id: 'eevee', name: 'eevee', silhouette: '🦊', emoji: '🦊✨', type: 'Normal', hint: 'Evolution Pokemon' },
];

function WhosThatPokemonGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Select random Pokemon
    const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
    setCurrentPokemon(randomPokemon);
    
    updateMessage('Who\'s that Pokemon?');
    if (sendVoiceMessage) {
      sendVoiceMessage('Who\'s that Pokemon? Look at the silhouette and tell me which Pokemon this is! Gotta catch \'em all!');
    }
    
    if (playSound) {
      playSound('pokemon-theme');
    }

    // Show hint after 5 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      updateMessage(`Hint: ${randomPokemon.hint} (${randomPokemon.type} type)`);
      if (sendVoiceMessage) {
        sendVoiceMessage(`Here's a hint: This is a ${randomPokemon.type} type Pokemon. ${randomPokemon.hint}`);
      }
    }, 5000);

    return () => clearTimeout(hintTimer);
  }, [updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentPokemon) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        const correctName = currentPokemon.name.toLowerCase();
        
        // Check if the answer contains the correct Pokemon name
        if (input.includes(correctName)) {
          setHasAnswered(true);
          setRevealed(true);
          
          updateMessage(`It's ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!`);
          
          if (playSound) {
            playSound('pokemon-caught');
          }
          
          if (sendVoiceMessage) {
            sendVoiceMessage(`That's right! It's ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}! You're a Pokemon master!`);
          }
          
          const score = showHint ? 75 : 100; // Less points if hint was shown
          
          setTimeout(() => {
            endGame(true, `Pokemon master! You caught ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!`, score);
          }, 2000);
        } else {
          // Check if they named another Pokemon
          const otherPokemon = pokemon.filter(p => p.id !== currentPokemon.id);
          const mentionedOtherPokemon = otherPokemon.some(p => input.includes(p.name));
          
          setHasAnswered(true);
          setRevealed(true);
          
          if (mentionedOtherPokemon) {
            updateMessage(`Not quite! It's ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Close guess, but it's actually ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}! Better luck next time, trainer!`);
            }
          } else {
            updateMessage(`It's ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`It's ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}! Keep training, Pokemon trainer!`);
            }
          }
          
          setTimeout(() => {
            endGame(false, `It was ${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!`, 0);
          }, 2000);
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, currentPokemon, showHint, endGame, updateMessage, sendVoiceMessage, playSound]);

  if (!currentPokemon) {
    return <div>Loading Pokemon...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-red-500 rounded-lg p-8 relative overflow-hidden">
      {/* Pokeball background elements */}
      <div className="absolute top-4 right-4 text-4xl opacity-20 animate-spin-slow">⚪</div>
      <div className="absolute bottom-4 left-4 text-3xl opacity-20 animate-bounce">⚪</div>
      
      <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl p-6 mb-6">
        <h2 className="text-4xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'serif' }}>
          🔥 Who's That Pokemon? 🔥
        </h2>
        
        {/* Pokemon display area */}
        <div className="bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-lg p-8 mb-6 border-4 border-yellow-600">
          <div className="text-center">
            {!revealed ? (
              // Silhouette mode
              <div className="relative">
                <div 
                  className="text-8xl mb-4 filter brightness-0 transform scale-110"
                  style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                >
                  {currentPokemon.silhouette}
                </div>
                <div className="text-6xl absolute inset-0 flex items-center justify-center opacity-20">
                  {currentPokemon.silhouette}
                </div>
                <div className="text-2xl font-bold text-gray-800 animate-pulse">
                  🤔 Mystery Pokemon 🤔
                </div>
              </div>
            ) : (
              // Revealed mode
              <div className="animate-bounce-in">
                <div className="text-8xl mb-4">
                  {currentPokemon.emoji}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}!
                </div>
                <div className="text-lg text-gray-600">
                  {currentPokemon.type} Type
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint section */}
        {showHint && !revealed && (
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-4">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-lg font-semibold text-blue-800">
              Type: {currentPokemon.type}
            </p>
            <p className="text-md text-blue-700">
              {currentPokemon.hint}
            </p>
          </div>
        )}

        {/* Voice input prompt */}
        {!revealed && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
            <div className="text-3xl mb-2">🎤</div>
            <p className="text-lg font-semibold text-red-800">
              Say the Pokemon's name!
            </p>
            {hasAnswered && (
              <div className="mt-4 text-red-600">
                <div className="animate-spin text-2xl mb-2">⚪</div>
                <p>Checking Pokedex...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pokemon trainer elements */}
      <div className="flex justify-center space-x-4 text-2xl opacity-60">
        <span className="animate-bounce">⚪</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔴</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⚪</span>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
      `}</style>
    </div>
  );
}

export default function WhosThatPokemonGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Who's That Pokemon?"
      instructions="Look at the silhouette and identify the Pokemon!"
      duration={12}
      {...props}
    >
      <WhosThatPokemonGame />
    </BaseGame>
  );
}