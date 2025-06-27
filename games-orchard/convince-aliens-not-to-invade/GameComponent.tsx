"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const alienMessages = [
  "Greetings, human. We have come to claim your planet for our empire.",
  "Earthling, your species has proven itself unworthy. Prepare for conquest.",
  "We are the Zephyrians. Your world will make a fine addition to our collection.",
  "Human creature, we have traveled far to subjugate your kind. Why should we spare you?"
];

const alienReasons = [
  "Your planet's resources will fuel our fleet.",
  "Your species shows promise but needs proper guidance.",
  "We require a new home world for our expanding population.",
  "Earth's strategic location makes it valuable to our empire."
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function ConvinceAliensGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [alienMessage, setAlienMessage] = useState('');
  const [alienReason, setAlienReason] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showAliens, setShowAliens] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize alien messages once on mount
  useEffect(() => {
    const randomMessage = alienMessages[Math.floor(Math.random() * alienMessages.length)];
    const randomReason = alienReasons[Math.floor(Math.random() * alienReasons.length)];
    
    setAlienMessage(randomMessage);
    setAlienReason(randomReason);
  }, []);

  // Handle game sequence when messages are set
  useEffect(() => {
    if (alienMessage && alienReason && !isInitialized) {
      updateMessage('A UFO is landing...');
      setIsInitialized(true);
      
      setTimeout(() => {
        setShowAliens(true);
        updateMessage('First contact! Convince them not to invade!');
        
        if (sendVoiceMessage) {
          sendVoiceMessage(`${alienMessage} ${alienReason}`);
        }
        
        if (playSound) {
          playSound('ufo-landing');
        }
      }, 2000);
    }
  }, [alienMessage, alienReason, isInitialized, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showAliens) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 15) { // Substantial diplomatic response
          setHasAnswered(true);
          
          // Diplomatic success criteria
          const diplomaticKeywords = [
            'peace', 'friendship', 'cooperation', 'together', 'help', 'learn',
            'share', 'alliance', 'mutual', 'benefit', 'respect', 'honor',
            'culture', 'knowledge', 'wisdom', 'protect', 'preserve', 'explore'
          ];
          
          const aggressiveKeywords = [
            'fight', 'war', 'weapon', 'destroy', 'kill', 'attack', 'defend',
            'resist', 'never', 'death'
          ];
          
          const hasDiplomaticKeywords = diplomaticKeywords.some(keyword => 
            input.includes(keyword)
          );
          
          const hasAggressiveKeywords = aggressiveKeywords.some(keyword => 
            input.includes(keyword)
          );
          
          const isLong = input.length > 50; // Thoughtful responses
          const mentionsHumanity = input.includes('human') || input.includes('earth') || 
                                  input.includes('planet') || input.includes('species');
          
          let score = 0;
          if (hasDiplomaticKeywords) score += 50;
          if (isLong) score += 30;
          if (mentionsHumanity) score += 20;
          if (hasAggressiveKeywords) score -= 40;
          
          if (score >= 70) {
            updateMessage('The aliens are impressed by your diplomacy!');
            if (sendVoiceMessage) {
              sendVoiceMessage('Fascinating... your species shows wisdom. We shall reconsider our plans. Perhaps cooperation is preferable to conquest.');
            }
            endGame(true, 'Humanity saved! The aliens choose peace over invasion.', score);
          } else if (score >= 30) {
            updateMessage('The aliens are considering your words...');
            if (sendVoiceMessage) {
              sendVoiceMessage('Hmm... your words have merit, but we are not fully convinced. We shall postpone our invasion for now.');
            }
            endGame(true, 'Partial success! You bought humanity some time.', score);
          } else {
            updateMessage('The aliens are not convinced by your argument.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Your words fall on deaf ears, human. The invasion proceeds as planned!');
            }
            endGame(false, 'Diplomacy failed. The invasion begins...', score);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showAliens, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showAliens ? (
        <div className="text-center">
          <div className="text-8xl transition-all duration-1000 ease-in-out">🛸</div>
          <p className="text-2xl mt-4 opacity-80">*Spaceship descending*</p>
          <div className="text-4xl mt-4">👽</div>
        </div>
      ) : (
        <>
          <div className="bg-purple-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-purple-400">
            <div className="text-6xl mb-4">👽</div>
            <h3 className="text-2xl font-bold mb-4 text-purple-200">ALIEN TRANSMISSION</h3>
            <div className="bg-black bg-opacity-50 rounded p-4 mb-4">
              <p className="text-lg text-green-300 font-mono">{alienMessage}</p>
            </div>
            <div className="bg-red-900 bg-opacity-50 rounded p-4">
              <p className="text-md text-red-200">{alienReason}</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Be humanity's first diplomat! Convince them to spare Earth!
          </p>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>The aliens are deliberating...</p>
              <div className="text-4xl mt-2">👽</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ConvinceAliensGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Convince Aliens Not to Invade"
      instructions="First contact! Use diplomacy to save humanity from alien invasion!"
      duration={12}
      {...props}
    >
      <ConvinceAliensGame />
    </BaseGame>
  );
}