"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const bullyTaunts = [
  "Hey loser! Nice clothes... did your mom pick them out for you?",
  "Look who it is - the class nerd! Still carrying your lunch money?",
  "What's up, weakling? Gonna cry and run to teacher again?",
  "Well well, if it isn't the school's biggest failure!",
  "Hey four-eyes! Can you even see how pathetic you are?",
  "Nice haircut! Did you stick your finger in an electrical socket?",
  "Aww, does baby need their mommy? So sad!",
  "You're such a loser, even your shadow tries to get away from you!"
];

const goodComebacks = [
  "at least", "your mom", "mirror", "yourself", "better", "than you",
  "says the", "coming from", "that's rich", "jealous", "insecure",
  "projection", "try harder", "weak", "pathetic", "embarrassing"
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function PwnBullyGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [bullyTaunt, setBullyTaunt] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showBully, setShowBully] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize bully taunt once on mount
  useEffect(() => {
    const randomTaunt = bullyTaunts[Math.floor(Math.random() * bullyTaunts.length)];
    setBullyTaunt(randomTaunt);
  }, []);

  // Handle game sequence when taunt is set
  useEffect(() => {
    if (bullyTaunt && !isInitialized) {
      updateMessage('A bully approaches...');
      setIsInitialized(true);
      
      setTimeout(() => {
        setShowBully(true);
        updateMessage('Quick! Deliver the perfect comeback!');
        
        if (sendVoiceMessage) {
          sendVoiceMessage(bullyTaunt);
        }
        
        if (playSound) {
          playSound('bully-taunt');
        }
      }, 2000);
    }
  }, [bullyTaunt, isInitialized, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showBully) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 8) { // Substantial comeback
          setHasAnswered(true);
          
          // Comeback evaluation criteria
          const hasGoodComebackWord = goodComebacks.some(phrase => 
            input.includes(phrase)
          );
          
          const isCreative = input.length > 25; // Longer = more creative
          const isClever = input.includes('your') || input.includes('you');
          const hasWit = input.includes('?') || input.includes('!');
          const turnsItAround = input.includes('says') || input.includes('coming from') || 
                               input.includes('least') || input.includes('better');
          
          let score = 20; // Base score
          if (hasGoodComebackWord) score += 30;
          if (isCreative) score += 25;
          if (isClever) score += 15;
          if (hasWit) score += 10;
          if (turnsItAround) score += 20;
          
          if (score >= 80) {
            updateMessage('DEVASTATING! The bully is speechless!');
            if (sendVoiceMessage) {
              sendVoiceMessage('Ohhhhh! *crowd gasps* The bully walks away in shame! That was BRUTAL!');
            }
            endGame(true, 'Epic comeback! You absolutely destroyed them!', score);
          } else if (score >= 60) {
            updateMessage('Nice comeback! The bully looks hurt.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Oof, that actually stung a bit. Good one...');
            }
            endGame(true, 'Solid comeback! You held your own.', score);
          } else {
            updateMessage('The bully just laughs at your weak response.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Haha, is that the best you got? Pathetic!');
            }
            endGame(false, 'Your comeback was weak. The bully wins this round.', score);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showBully, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showBully ? (
        <div className="text-center">
          <div className="text-8xl">😠</div>
          <p className="text-2xl mt-4 opacity-80">*Bully approaching*</p>
        </div>
      ) : (
        <>
          <div className="bg-red-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-red-400">
            <div className="text-6xl mb-4">😈</div>
            <h3 className="text-2xl font-bold mb-4 text-red-200">THE BULLY SAYS:</h3>
            <div className="bg-black bg-opacity-50 rounded p-4">
              <p className="text-lg text-red-300 font-bold">"{bullyTaunt}"</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Quick! Deliver the perfect comeback!
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Tip: Turn it around on them, be clever, show confidence!</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>The crowd watches to see who wins...</p>
              <div className="text-4xl mt-2">👥</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PwnBullyGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Pwn the Bully"
      instructions="A bully is picking on you! Deliver the perfect comeback to shut them down!"
      duration={8}
      {...props}
    >
      <PwnBullyGame />
    </BaseGame>
  );
}