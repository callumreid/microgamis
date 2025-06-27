"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const policeLines = [
  "Police! Open up! We have a warrant!",
  "This is the police! We need to ask you some questions!",
  "Ma'am/Sir, please open the door. We're investigating a robbery.",
  "Police department! We need to speak with you immediately!"
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
  gameState: any;
}

function StallPoliceGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound, gameState }: GameControlProps) {
  const [policeLine, setPoliceLine] = useState('');
  const [stallCount, setStallCount] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showPolice, setShowPolice] = useState(false);

  useEffect(() => {
    const randomLine = policeLines[Math.floor(Math.random() * policeLines.length)];
    setPoliceLine(randomLine);
    
    updateMessage('Someone is knocking at your door...');
    
    setTimeout(() => {
      setShowPolice(true);
      updateMessage('Stall them until time runs out!');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(randomLine);
      }
      
      if (playSound) {
        playSound('police-knock');
      }
    }, 2000);
  }, [updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && showPolice) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 5) { // Any substantial response
          setStallCount(prev => prev + 1);
          
          // Stall tactics
          const goodStalls = [
            'just a minute', 'one second', 'getting dressed', 'bathroom',
            'can you wait', 'hold on', 'coming', 'almost ready', 'sick',
            'sleeping', 'shower', 'getting the door', 'looking for keys'
          ];
          
          const isGoodStall = goodStalls.some(stall => input.includes(stall));
          
          if (gameState.timeRemaining <= 1) {
            // Time's up - player wins!
            updateMessage('Time\'s up! You successfully stalled them!');
            if (sendVoiceMessage) {
              sendVoiceMessage('We\'ll have to come back later. Have a good day!');
            }
            endGame(true, `Great stalling! You kept them busy for ${stallCount} responses.`, stallCount * 20);
          } else if (isGoodStall) {
            updateMessage('Good stall! Keep them waiting...');
            if (sendVoiceMessage) {
              sendVoiceMessage('Okay, we\'ll wait a moment. Please hurry up though.');
            }
          } else {
            updateMessage('Weak stall. They\'re getting suspicious...');
            if (sendVoiceMessage) {
              sendVoiceMessage('That\'s not a good excuse. We\'re coming in now!');
            }
            endGame(false, 'Your stalling wasn\'t convincing enough.', stallCount * 10);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, showPolice, stallCount, gameState.timeRemaining, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showPolice ? (
        <div className="text-center">
          <div className="text-8xl animate-pulse">🚪</div>
          <p className="text-2xl mt-4">*KNOCK KNOCK KNOCK*</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-blue-400">
            <div className="text-6xl mb-4">👮‍♂️👮‍♀️</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-200">🚨 POLICE AT YOUR DOOR 🚨</h3>
            <div className="bg-black bg-opacity-50 rounded p-4">
              <p className="text-lg text-blue-300">"{policeLine}"</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Make excuses to stall them! (Stalls: {stallCount})
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 "Just a minute!", "Getting dressed!", "In the bathroom!"</p>
          </div>
          
          <div className="mt-4 text-green-300">
            <p>Time remaining: {gameState.timeRemaining}s</p>
          </div>
        </>
      )}
    </div>
  );
}

export default function StallPoliceGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Stall the Police"
      instructions="Police are at your door! Make excuses to stall them until time runs out!"
      duration={12}
      {...props}
    >
      <StallPoliceGame />
    </BaseGame>
  );
}