"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const investors = ['💼 Goldman Partners', '🏦 Venture Capital Inc', '💰 Angel Investments', '🚀 Tech Fund LLC'];
const industries = ['AI', 'Blockchain', 'Health Tech', 'Climate Tech', 'FinTech', 'EdTech', 'Gaming', 'Food Tech'];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function PitchStartupGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [investor, setInvestor] = useState('');
  const [industry, setIndustry] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const randomInvestor = investors[Math.floor(Math.random() * investors.length)];
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
    
    setInvestor(randomInvestor);
    setIndustry(randomIndustry);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    updateMessage('You\'re entering the boardroom...');
    
    setTimeout(() => {
      setShowMeeting(true);
      updateMessage('Make your pitch count!');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(`Welcome to ${investor}. We're looking for the next big thing in ${industry}. You have one chance to pitch us your startup idea. Make it compelling!`);
      }
      
      if (playSound) {
        playSound('boardroom-ambiance');
      }
    }, 2000);
  }, [isInitialized, investor, industry, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (!isInitialized || !onVoiceInput || hasAnswered || !showMeeting) return;
    
    const handleVoiceInput = (transcript: string) => {
      const input = transcript.toLowerCase().trim();
      
      if (input.length > 20) { // Substantial pitch
        setHasAnswered(true);
        
        // Pitch evaluation criteria
        const businessWords = [
          'market', 'revenue', 'customers', 'problem', 'solution', 'scale',
          'growth', 'profit', 'business model', 'competitive advantage',
          'traction', 'users', 'sales', 'monetize', 'disruption'
        ];
        
        const techWords = [
          'platform', 'app', 'technology', 'innovation', 'algorithm',
          'data', 'analytics', 'automation', 'efficiency', 'digital'
        ];
        
        const industryWords = [industry.toLowerCase(), 'ai', 'tech', 'software'];
        
        const hasBusiness = businessWords.some(word => input.includes(word));
        const hasTech = techWords.some(word => input.includes(word));
        const hasIndustry = industryWords.some(word => input.includes(word));
        const isDetailed = input.length > 100;
        const hasPassion = input.includes('we') || input.includes('our') || 
                         input.includes('vision') || input.includes('believe');
        
        let score = 20; // Base score
        if (hasBusiness) score += 30;
        if (hasTech) score += 20;
        if (hasIndustry) score += 15;
        if (isDetailed) score += 20;
        if (hasPassion) score += 15;
        
        if (score >= 90) {
          updateMessage('Incredible pitch! The investors are writing checks!');
          if (sendVoiceMessage) {
            sendVoiceMessage('Outstanding! We\'re prepared to offer you $5 million for 20% equity. When can you start?');
          }
          endGame(true, 'FUNDED! You secured a massive investment round!', score);
        } else if (score >= 70) {
          updateMessage('Strong pitch! They\'re interested but want more details.');
          if (sendVoiceMessage) {
            sendVoiceMessage('Interesting concept. Send us your business plan and we\'ll consider a smaller investment.');
          }
          endGame(true, 'Promising! You got their attention for follow-up meetings.', score);
        } else if (score >= 50) {
          updateMessage('Decent idea but needs work. They\'re politely passing.');
          if (sendVoiceMessage) {
            sendVoiceMessage('Thank you for coming in. We\'ll need to see more traction before investing.');
          }
          endGame(false, 'Close but not quite there. Keep refining your pitch.', score);
        } else {
          updateMessage('The investors look confused and unimpressed.');
          if (sendVoiceMessage) {
            sendVoiceMessage('I\'m sorry, but this doesn\'t align with our investment thesis. Good luck with your venture.');
          }
          endGame(false, 'Pitch failed. You need a clearer business model.', score);
        }
      }
    };
    
    onVoiceInput(handleVoiceInput);
  }, [isInitialized, onVoiceInput, hasAnswered, showMeeting, industry, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showMeeting ? (
        <div className="text-center">
          <div className="text-8xl">🏢</div>
          <p className="text-2xl mt-4">*Entering the boardroom*</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-gray-400">
            <div className="text-6xl mb-4">👔💼👩‍💼</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200">{investor}</h3>
            <div className="bg-white bg-opacity-90 rounded p-4 text-black mb-4">
              <p className="font-bold">Investment Focus: {industry}</p>
            </div>
            <div className="text-green-400">
              <p>💰 $10M Fund Available 💰</p>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Pitch your {industry} startup idea!
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Mention: problem, solution, market, revenue model</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>The investors are deliberating...</p>
              <div className="text-4xl mt-2">💭</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PitchStartupGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Pitch Your Startup"
      instructions="You're in front of investors! Make up a compelling startup pitch on the spot!"
      duration={15}
      {...props}
    >
      <PitchStartupGame />
    </BaseGame>
  );
}