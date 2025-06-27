"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const scenarios = [
  "Why are you late to work?",
  "Why didn't you finish the project on time?",
  "Why weren't you at the meeting?", 
  "Why did you miss the deadline?",
  "Why aren't you ready for the presentation?",
  "Why is your report incomplete?",
  "Why didn't you respond to my emails?",
  "Why weren't you at the team lunch?"
];

const phoneRings = [
  "Ring ring... Hello? Hey buddy, where are you?",
  "*RING RING* Pick up! Seriously, where are you?",
  "Your phone is buzzing... 'Boss' is calling...",
  "*Vibrate vibrate* You see 'Work' on the caller ID..."
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function MakeExcuseGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [scenario, setScenario] = useState('');
  const [phoneRing, setPhoneRing] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const randomRing = phoneRings[Math.floor(Math.random() * phoneRings.length)];
    
    setScenario(randomScenario);
    setPhoneRing(randomRing);
    
    updateMessage('Your phone is ringing...');
    
    setTimeout(() => {
      setShowPhone(true);
      updateMessage(`${randomScenario} Make a convincing excuse!`);
      
      if (sendVoiceMessage) {
        sendVoiceMessage(randomRing + " " + randomScenario);
      }
      
      if (playSound) {
        playSound('phone-ring');
      }
    }, 2000);
  }, [updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && showPhone) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 10) { // Substantial response
          setHasAnswered(true);
          
          // AI evaluation criteria for a "good" excuse
          const goodExcuseKeywords = [
            'traffic', 'emergency', 'family', 'sick', 'doctor', 'hospital', 
            'car', 'accident', 'train', 'delayed', 'appointment', 'urgent',
            'sorry', 'apologize', 'internet', 'power', 'meeting', 'client'
          ];
          
          const hasGoodKeyword = goodExcuseKeywords.some(keyword => 
            input.includes(keyword)
          );
          
          const isCreative = input.length > 30; // Longer responses get bonus points
          const isPolite = input.includes('sorry') || input.includes('apologize');
          
          const score = (hasGoodKeyword ? 40 : 0) + (isCreative ? 30 : 0) + (isPolite ? 30 : 0);
          
          if (score >= 60) {
            updateMessage('Your boss believes your excuse! Well done.');
            if (sendVoiceMessage) {
              sendVoiceMessage('Okay, that sounds reasonable. Just try to be on time next time!');
            }
            endGame(true, 'Convincing excuse! Your boss bought it.', score);
          } else {
            updateMessage('Your boss is not convinced... Try harder next time!');
            if (sendVoiceMessage) {
              sendVoiceMessage('That excuse is pretty weak. I expect better from you.');
            }
            endGame(false, 'Your excuse was not convincing enough.', score);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, showPhone, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showPhone ? (
        <div className="text-6xl animate-pulse">
          📱
          <p className="text-2xl mt-4">*Ring Ring*</p>
        </div>
      ) : (
        <>
          <div className="bg-black bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-gray-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">📞 INCOMING CALL</h3>
            <p className="text-lg mb-4 text-white">{phoneRing}</p>
            <div className="bg-red-600 bg-opacity-20 border border-red-400 rounded p-4">
              <p className="text-xl font-bold text-red-200">{scenario}</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Speak your excuse out loud!
          </p>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>Your boss is considering your excuse...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MakeExcuseGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Make Up an Excuse"
      instructions="Your boss is calling! Make a convincing excuse for why you're late!"
      duration={10}
      {...props}
    >
      <MakeExcuseGame />
    </BaseGame>
  );
}