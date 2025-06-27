"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const scenarios = [
  "Daddy, why did grandpa go to sleep forever?",
  "Mommy, where did our dog Max go? Will he come back?",
  "Why can't I see grandma anymore? I miss her.",
  "What happens when people die? Do they hurt?",
  "Why are you crying about uncle John?",
  "Will you die too, mommy? I'm scared."
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function ExplainDeathGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [scenario, setScenario] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(randomScenario);
    
    updateMessage('Your daughter approaches with tears in her eyes...');
    
    setTimeout(() => {
      setShowChild(true);
      updateMessage('Handle this delicate conversation with care.');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(randomScenario);
      }
    }, 2000);
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showChild) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 15) { // Substantial response
          setHasAnswered(true);
          
          // Criteria for a good explanation
          const comfortingWords = [
            'love', 'remember', 'memories', 'special', 'heart', 'forever',
            'care', 'safe', 'okay', 'understand', 'together', 'hug'
          ];
          
          const ageAppropriate = [
            'sleep', 'peaceful', 'happy', 'heaven', 'star', 'angel',
            'nature', 'cycle', 'natural', 'part of life'
          ];
          
          const avoidScaryWords = !input.includes('scary') && !input.includes('pain') && 
                                  !input.includes('hurt') && !input.includes('never');
          
          const hasComfort = comfortingWords.some(word => input.includes(word));
          const isAgeAppropriate = ageAppropriate.some(word => input.includes(word));
          const isThoughtful = input.length > 50;
          const acknowledgesEmotions = input.includes('sad') || input.includes('miss') || 
                                     input.includes('cry') || input.includes('feel');
          
          let score = 20; // Base score
          if (hasComfort) score += 30;
          if (isAgeAppropriate) score += 25;
          if (avoidScaryWords) score += 15;
          if (isThoughtful) score += 20;
          if (acknowledgesEmotions) score += 10;
          
          if (score >= 80) {
            updateMessage('Beautiful explanation. Your daughter feels comforted and understood.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Thank you for explaining it so nicely. I feel better now. Can I have a hug?');
            }
            endGame(true, 'Excellent parenting! You handled this with perfect care and sensitivity.', score);
          } else if (score >= 60) {
            updateMessage('Good effort. Your daughter is still confused but feels loved.');
            if (sendVoiceMessage) {
              sendVoiceMessage('I still don\'t understand everything, but I know you love me.');
            }
            endGame(true, 'Decent explanation. Could have been more comforting but showed care.', score);
          } else {
            updateMessage('Your daughter is more confused and upset now.');
            if (sendVoiceMessage) {
              sendVoiceMessage('I\'m scared now... that doesn\'t make me feel better...');
            }
            endGame(false, 'The explanation was too confusing or frightening for a child.', score);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showChild, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showChild ? (
        <div className="text-center">
          <div className="text-8xl">👧</div>
          <p className="text-2xl mt-4 animate-pulse">*Footsteps approaching*</p>
        </div>
      ) : (
        <>
          <div className="bg-pink-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-pink-400">
            <div className="text-6xl mb-4">👧</div>
            <h3 className="text-2xl font-bold mb-4 text-pink-200">YOUR DAUGHTER</h3>
            <div className="bg-white bg-opacity-90 rounded p-4 text-black">
              <p className="text-lg italic">"{scenario}"</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Explain death in a way a child can understand
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Be gentle, age-appropriate, and comforting</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>Your daughter is processing your words...</p>
              <div className="text-4xl animate-pulse mt-2">💭</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ExplainDeathGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Explain Death to Daughter"
      instructions="Your child has questions about death. Handle this delicate conversation with care."
      duration={15}
      {...props}
    >
      <ExplainDeathGame />
    </BaseGame>
  );
}