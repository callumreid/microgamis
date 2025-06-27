"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface BurgerIngredient {
  id: string;
  name: string;
  emoji: string;
  order: number;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const burgerIngredients: BurgerIngredient[] = [
  { id: 'bottom-bun', name: 'bottom bun', emoji: '🟤', order: 1 },
  { id: 'lettuce', name: 'lettuce', emoji: '🥬', order: 2 },
  { id: 'tomato', name: 'tomato', emoji: '🍅', order: 3 },
  { id: 'cheese', name: 'cheese', emoji: '🧀', order: 4 },
  { id: 'patty', name: 'patty', emoji: '🥩', order: 5 },
  { id: 'onion', name: 'onion', emoji: '🧅', order: 6 },
  { id: 'top-bun', name: 'top bun', emoji: '🟫', order: 7 },
];

function AssembleTheBurgerGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [displayedIngredients, setDisplayedIngredients] = useState<BurgerIngredient[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showingIngredients, setShowingIngredients] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game data once
  useEffect(() => {
    if (!isInitialized) {
      // Shuffle ingredients for display
      const shuffled = [...burgerIngredients].sort(() => Math.random() - 0.5);
      setDisplayedIngredients(shuffled);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle game setup and timing
  useEffect(() => {
    if (isInitialized) {
      updateMessage('Memorize these burger ingredients!');\n      if (sendVoiceMessage) {
        sendVoiceMessage('Welcome to Burger Assembly! I\'m going to show you all the ingredients for a perfect burger. Pay attention to what you see, then tell me the correct order to stack them from bottom to top!');
      }

      // Hide ingredients after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowingIngredients(false);
        updateMessage('Now tell me the correct order from bottom to top!');
        if (sendVoiceMessage) {
          sendVoiceMessage('Time to build that burger! Tell me the ingredients in the correct order from bottom to top. Remember: bottom bun first, then lettuce, tomato, cheese, patty, onion, and top bun!');
        }
      }, 5000);

      return () => clearTimeout(hideTimer);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && !showingIngredients) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 20) { // Substantial ordering attempt
          setHasAnswered(true);
          
          // Extract mentioned ingredients
          const mentionedIngredients: string[] = [];
          burgerIngredients.forEach(ingredient => {
            if (input.includes(ingredient.name) || input.includes(ingredient.id.replace('-', ' '))) {
              mentionedIngredients.push(ingredient.name);
            }
          });
          
          setUserOrder(mentionedIngredients);
          
          // Check correctness
          const correctOrder = burgerIngredients
            .sort((a, b) => a.order - b.order)
            .map(ing => ing.name);
          
          let score = 0;
          let correctPositions = 0;
          
          // Check how many ingredients are in correct positions
          for (let i = 0; i < Math.min(mentionedIngredients.length, correctOrder.length); i++) {
            if (mentionedIngredients[i] === correctOrder[i]) {
              correctPositions++;
              score += 15;
            }
          }
          
          // Bonus for mentioning all ingredients
          if (mentionedIngredients.length === correctOrder.length) {
            score += 10;
          }
          
          // Check if buns are in right places (critical)
          const hasBottomBunFirst = mentionedIngredients[0] === 'bottom bun';
          const hasTopBunLast = mentionedIngredients[mentionedIngredients.length - 1] === 'top bun';
          
          if (hasBottomBunFirst) score += 10;
          if (hasTopBunLast) score += 10;
          
          if (score >= 80) {
            updateMessage('Perfect burger! The chef is impressed!');
            if (sendVoiceMessage) {
              sendVoiceMessage('Outstanding! You\'ve built the perfect burger! Every ingredient is in exactly the right place. The chef gives you a standing ovation!');
            }
            
            if (playSound) {
              playSound('cooking-success');
            }
            
            endGame(true, 'Master chef! Perfect burger assembly!', score);
          } else if (score >= 50) {
            updateMessage('Good attempt! Most ingredients are in the right place.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Not bad! You got most of the burger right. The chef nods approvingly, though there\'s room for improvement in your stacking technique.');
            }
            endGame(true, 'Decent burger! Some ingredients out of place.', score);
          } else {
            updateMessage('Hmm, that burger looks a bit mixed up...');
            if (sendVoiceMessage) {
              sendVoiceMessage('Oh dear! That burger is quite jumbled. The chef scratches his head in confusion. Maybe you need more practice with burger architecture!');
            }
            endGame(false, 'Burger disaster! Wrong ingredient order.', Math.max(10, score));
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showingIngredients, endGame, updateMessage, sendVoiceMessage, playSound]);

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 rounded-lg p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-4 border-orange-400">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">🍔 Assemble The Burger!</h2>
        
        {showingIngredients ? (
          <div>
            <div className="text-lg font-semibold text-gray-700 mb-4">
              Memorize these ingredients:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {displayedIngredients.map((ingredient) => (
                <div key={ingredient.id} className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                  <div className="text-4xl mb-2">{ingredient.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-orange-600 font-bold animate-pulse">
              Study these ingredients carefully!
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-4">🍔</div>
              <h3 className="text-xl font-bold text-orange-800 mb-4">
                Build Your Burger!
              </h3>
              <p className="text-orange-700 mb-4">
                Tell me the ingredients in order from bottom to top
              </p>
              <div className="text-sm text-orange-600">
                Start with the bottom bun and work your way up!
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="text-3xl mb-2">🎤</div>
              <p className="text-lg font-semibold text-blue-800 mb-2">
                Say the ingredients in order!
              </p>
              <p className="text-sm text-blue-600">
                Example: "Bottom bun, lettuce, tomato..."
              </p>
              
              {hasAnswered && (
                <div className="mt-4 text-blue-600">
                  <div className="animate-spin text-2xl mb-2">🍔</div>
                  <p>The chef is checking your order...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cooking atmosphere */}
      <div className="flex justify-center space-x-4 text-2xl opacity-50">
        <span className="animate-bounce">👨‍🍳</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍳</span>
        <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🧑‍🍳</span>
      </div>
    </div>
  );
}

export default function AssembleTheBurgerGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Assemble The Burger"
      instructions="Memorize the ingredients and say them in the correct stacking order!"
      duration={12}
      {...props}
    >
      <AssembleTheBurgerGame />
    </BaseGame>
  );
}"