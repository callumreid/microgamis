"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface ChildScenario {
  id: string;
  problem: string;
  childQuote: string;
  context: string;
  goodAdviceKeywords: string[];
  badAdviceKeywords: string[];
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
  gameState?: any;
  updateScore?: (score: number) => void;
}

const scenarios: ChildScenario[] = [
  {
    id: 'bully',
    problem: 'Being bullied at school',
    childQuote: 'Mom/Dad, there\'s a kid at school who keeps calling me names and taking my lunch money. What should I do?',
    context: 'A child is experiencing bullying and needs guidance',
    goodAdviceKeywords: ['tell', 'teacher', 'adult', 'parent', 'help', 'talk', 'report', 'safe', 'support'],
    badAdviceKeywords: ['fight', 'hit', 'punch', 'ignore', 'deal with it', 'suck it up', 'be tough']
  },
  {
    id: 'friend_pressure',
    problem: 'Peer pressure from friends',
    childQuote: 'My friends want me to skip class with them, but I don\'t want to get in trouble. They say I\'m being a baby.',
    context: 'A child faces peer pressure to do something wrong',
    goodAdviceKeywords: ['right', 'choice', 'consequences', 'proud', 'stand up', 'true friends', 'values', 'integrity'],
    badAdviceKeywords: ['go along', 'not big deal', 'everyone does it', 'just once']
  },
  {
    id: 'homework',
    problem: 'Struggling with homework',
    childQuote: 'I have so much homework and it\'s really hard. I don\'t understand any of it and I want to give up.',
    context: 'A child is overwhelmed with schoolwork',
    goodAdviceKeywords: ['help', 'break down', 'small steps', 'ask questions', 'teacher', 'try', 'practice', 'support'],
    badAdviceKeywords: ['give up', 'not important', 'cheat', 'copy', 'skip it']
  },
  {
    id: 'jealousy',
    problem: 'Feeling jealous of sibling',
    childQuote: 'My little brother always gets more attention than me. Everyone thinks he\'s so cute and special. I hate him sometimes.',
    context: 'A child is dealing with sibling jealousy',
    goodAdviceKeywords: ['feelings', 'normal', 'love', 'special', 'talk', 'understand', 'patience', 'time'],
    badAdviceKeywords: ['hate', 'get back', 'be mean', 'ignore', 'not fair']
  },
  {
    id: 'mistake',
    problem: 'Made a big mistake',
    childQuote: 'I accidentally broke Mom\'s favorite vase while playing inside. I\'m scared to tell her. Should I hide it?',
    context: 'A child made a mistake and is afraid of consequences',
    goodAdviceKeywords: ['truth', 'honest', 'sorry', 'apologize', 'accident', 'tell', 'responsibility', 'learn'],
    badAdviceKeywords: ['hide', 'lie', 'blame', 'pretend', 'cover up']
  }
];

function AdviseTheChildGame({ endGame, updateMessage, sendVoiceMessage }: Partial<GameControlProps>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ChildScenario | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Select random scenario
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setCurrentScenario(randomScenario);
      
      updateMessage?.('A child needs your advice...');
      if (sendVoiceMessage) {
        sendVoiceMessage(`A child comes to you with a problem and needs your wise advice. Listen carefully to what they have to say, then give them the best guidance you can. Here's what they say: ${randomScenario.childQuote}`);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  const handleAdviceSubmit = () => {
    if (hasAnswered || !currentScenario) return;
    
    setHasAnswered(true);
    
    // Simple placeholder scoring
    const score = 50;
    updateMessage?.('You gave some advice to the child.');
    if (sendVoiceMessage) {
      sendVoiceMessage('Thank you for your advice! The child appreciates your guidance.');
    }
   endGame?.(true, 'You provided guidance to the child.', score);
  };



  if (!currentScenario) {
    return <div>A child is approaching...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 rounded-lg p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">👶 Advise The Child</h2>
        
        {/* Child illustration */}
        <div className="bg-yellow-100 rounded-lg p-6 mb-6 border-4 border-yellow-300">
          <div className="text-6xl mb-4">😟</div>
          <div className="text-lg font-bold text-gray-700 mb-2">
            A Child&apos;s Problem:
          </div>
          <div className="text-md text-gray-600 mb-4 italic">
            &quot;{currentScenario.childQuote}&quot;
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 rounded p-2">
            Context: {currentScenario.context}
          </div>
        </div>

        {/* Advice prompt */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="text-lg font-semibold text-blue-800 mb-2">
            Give this child your best advice!
          </p>
          <p className="text-sm text-blue-600">
            Be empathetic, helpful, and age-appropriate
          </p>
          
          {!hasAnswered && (
            <button
              onClick={handleAdviceSubmit}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Advice (Placeholder)
            </button>
          )}
          
          {hasAnswered && (
            <div className="mt-4 text-blue-600">
              <div className="text-2xl mb-2">💭</div>
              <p>Considering your advice...</p>
            </div>
          )}
        </div>
      </div>

      {/* Parenting tips */}
      <div className="flex justify-center space-x-4 text-2xl opacity-50">
        <span>❤️</span>
        <span>🤗</span>
        <span>💪</span>
        <span>🌟</span>
      </div>
    </div>
  );
}

export default function AdviseTheChildGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Advise The Child"
      instructions="A child needs your guidance on a difficult situation!"
      duration={12}
      {...props}
    >
      <AdviseTheChildGame />
    </BaseGame>
  );
}