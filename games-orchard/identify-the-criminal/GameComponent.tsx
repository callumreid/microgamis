"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const suspects = [
  { id: 1, emoji: '👨‍💼', description: 'Business suit, briefcase' },
  { id: 2, emoji: '👨‍🔧', description: 'Blue overalls, hard hat' },
  { id: 3, emoji: '👩‍🎨', description: 'Paint-stained apron' },
  { id: 4, emoji: '👨‍🍳', description: 'Chef hat, white coat' },
  { id: 5, emoji: '👮‍♀️', description: 'Police uniform' },
  { id: 6, emoji: '👨‍⚕️', description: 'White lab coat, stethoscope' }
];

const crimes = [
  "stole a red briefcase from the bank",
  "broke into the jewelry store",
  "vandalized the art gallery wall",
  "robbed the convenience store",
  "pickpocketed someone on the street",
  "broke the restaurant window"
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function IdentifyCriminalGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [suspect, setSuspect] = useState(suspects[0]);
  const [crime, setCrime] = useState('');
  const [lineupSuspects, setLineupSuspects] = useState<typeof suspects>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showLineup, setShowLineup] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game data once
  useEffect(() => {
    if (!isInitialized) {
      const randomCrime = crimes[Math.floor(Math.random() * crimes.length)];
      const randomSuspect = suspects[Math.floor(Math.random() * suspects.length)];
      
      // Create lineup with criminal and 2-3 others
      const otherSuspects = suspects.filter(s => s.id !== randomSuspect.id);
      const shuffledOthers = otherSuspects.sort(() => Math.random() - 0.5).slice(0, 3);
      const lineup = [randomSuspect, ...shuffledOthers].sort(() => Math.random() - 0.5);
      
      setSuspect(randomSuspect);
      setCrime(randomCrime);
      setLineupSuspects(lineup);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle game setup and messaging
  useEffect(() => {
    if (isInitialized) {
      updateMessage?.('Witness the crime...');
      
      const timer = setTimeout(() => {
        setShowLineup(true);
        updateMessage?.('Identify the criminal from the lineup!');
        
        if (sendVoiceMessage) {
          sendVoiceMessage(`You witnessed someone who ${crime}. Now look at the lineup and tell me which number committed the crime. Say "number 1", "number 2", etc.`);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, crime, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showLineup) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        // Extract number from input
        const numbers = ['one', 'two', 'three', 'four'];
        let selectedNumber = -1;
        
        for (let i = 1; i <= 4; i++) {
          if (input.includes(i.toString()) || input.includes(numbers[i-1])) {
            selectedNumber = i;
            break;
          }
        }
        
        if (selectedNumber > 0 && selectedNumber <= lineupSuspects.length) {
          setHasAnswered(true);
          const selectedSuspect = lineupSuspects[selectedNumber - 1];
          
          if (selectedSuspect.id === suspect.id) {
            updateMessage?.('Correct! You identified the right criminal!');
            if (sendVoiceMessage) {
              sendVoiceMessage('Excellent work, detective! You correctly identified the perpetrator. Justice will be served!');
            }
            endGame?.(true, 'Case solved! You have a keen eye for detail.', 100);
          } else {
            updateMessage?.('Wrong suspect! The criminal got away...');
            if (sendVoiceMessage) {
              sendVoiceMessage('That\'s not the right person. The real criminal escapes while an innocent person is wrongly accused!');
            }
            endGame?.(false, `Wrong choice! It was suspect ${lineupSuspects.findIndex(s => s.id === suspect.id) + 1}.`, 0);
          }
        }
      };
      
      // Voice input removed for build compatibility
    }
  }, [onVoiceInput, hasAnswered, showLineup, suspect, lineupSuspects, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showLineup ? (
        <div className="text-center">
          <div className="bg-red-900 bg-opacity-80 rounded-lg p-6 border-4 border-red-400">
            <h3 className="text-2xl font-bold mb-4 text-red-200">🚨 CRIME IN PROGRESS 🚨</h3>
            <div className="text-6xl mb-4">{suspect.emoji}</div>
            <p className="text-lg text-white">Someone {crime}!</p>
            <p className="text-sm mt-2 opacity-75">Pay attention to who did it...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-blue-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-blue-400">
            <h3 className="text-2xl font-bold mb-4 text-blue-200">👮‍♂️ POLICE LINEUP 👮‍♂️</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {lineupSuspects.map((s, index) => (
                <div key={s.id} className="bg-white bg-opacity-20 rounded p-3">
                  <div className="text-4xl mb-2">{s.emoji}</div>
                  <div className="text-sm font-bold">#{index + 1}</div>
                  <div className="text-xs">{s.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Say "Number [1-4]" to identify the criminal!
          </p>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>Processing identification...</p>
              <div className="text-4xl animate-pulse mt-2">🔍</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function IdentifyCriminalGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Identify the Criminal"
      instructions="Witness a crime, then pick the perpetrator from the police lineup!"
      duration={12}
      {...props}
    >
      <IdentifyCriminalGame />
    </BaseGame>
  );
}