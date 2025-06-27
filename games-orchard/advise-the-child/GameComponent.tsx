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

function AdviseTheChildGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ChildScenario | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Select random scenario
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setCurrentScenario(randomScenario);
      
      updateMessage('A child needs your advice...');
      if (sendVoiceMessage) {
        sendVoiceMessage(`A child comes to you with a problem and needs your wise advice. Listen carefully to what they have to say, then give them the best guidance you can. Here's what they say: ${randomScenario.childQuote}`);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentScenario && isInitialized) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 20) { // Substantial advice
          setHasAnswered(true);
          
          const goodKeywordCount = currentScenario.goodAdviceKeywords.filter(keyword => 
            input.includes(keyword)
          ).length;
          
          const badKeywordCount = currentScenario.badAdviceKeywords.filter(keyword => 
            input.includes(keyword)
          ).length;
          
          const isLong = input.length > 50; // Thoughtful response
          const isEncouraging = input.includes('can') || input.includes('will') || input.includes('able');
          const isEmpathetic = input.includes('understand') || input.includes('feel') || input.includes('know');
          const hasQuestions = input.includes('?');
          
          let score = 0;
          
          // Positive scoring
          score += goodKeywordCount * 20;
          if (isLong) score += 15;
          if (isEncouraging) score += 10;
          if (isEmpathetic) score += 15;
          if (hasQuestions) score += 10; // Asking clarifying questions is good
          
          // Negative scoring
          score -= badKeywordCount * 25;
          
          if (score >= 60) {
            updateMessage('Excellent advice! The child feels supported and knows what to do.');
            if (sendVoiceMessage) {
              sendVoiceMessage('That was wonderful advice! You showed empathy, gave practical guidance, and helped the child feel supported. You\'d make a great parent or mentor!');
            }
            endGame(true, 'Wise counselor! Your advice was caring and helpful.', score);
          } else if (score >= 30) {
            updateMessage('Good advice! The child appreciates your help.');
            if (sendVoiceMessage) {
              sendVoiceMessage('That was decent advice. You showed some understanding and gave some helpful guidance. The child feels a bit better.');
            }
            endGame(true, 'Good guidance! The child feels somewhat helped.', score);
          } else {
            updateMessage('The child looks confused and upset by your advice...');
            if (sendVoiceMessage) {
              sendVoiceMessage('Oh dear... your advice might not have been the most helpful. The child seems more confused or upset than before. Maybe try being more empathetic and constructive next time.');
            }
            endGame(false, 'Poor advice. The child didn\'t feel helped.', Math.max(0, score));
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, currentScenario, isInitialized]);

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
            A Child's Problem:
          </div>
          <div className="text-md text-gray-600 mb-4 italic">
            "{currentScenario.childQuote}"
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