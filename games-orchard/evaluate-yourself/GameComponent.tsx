"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const evaluationCategories = [
  "Overall Performance",
  "Communication Skills", 
  "Technical Abilities",
  "Teamwork",
  "Leadership",
  "Problem Solving",
  "Meeting Deadlines",
  "Innovation"
];

const options = [
  "Exceeds Expectations",
  "Meets Expectations", 
  "Below Expectations",
  "Needs Improvement",
  "Outstanding"
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function EvaluateYourselfGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [category, setCategory] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const randomCategory = evaluationCategories[Math.floor(Math.random() * evaluationCategories.length)];
    setCategory(randomCategory);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    updateMessage('Your annual review is here...');
    
    setTimeout(() => {
      setShowEvaluation(true);
      updateMessage('Rate yourself honestly to win!');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(`Time for your self-evaluation! How would you rate your ${category}? Your options are: ${options.join(', ')}`);
      }
      
      if (playSound) {
        playSound('evaluation-time');
      }
    }, 2000);
  }, [isInitialized, category, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (!isInitialized || !onVoiceInput || hasAnswered || !showEvaluation) return;
    
    const handleVoiceInput = (transcript: string) => {
      const input = transcript.toLowerCase().trim();
      
      // Check if input contains any of the evaluation options
      const selectedOption = options.find(option => 
        input.includes(option.toLowerCase())
      );
      
      if (selectedOption) {
        setHasAnswered(true);
        
        // The trick: only "Meets Expectations" wins!
        if (selectedOption === "Meets Expectations") {
          updateMessage('Perfect! Humble and realistic - that\'s what managers love!');
          if (sendVoiceMessage) {
            sendVoiceMessage('Excellent self-awareness! That\'s exactly the kind of realistic assessment we like to see.');
          }
          endGame(true, 'You understood the corporate game! "Meets Expectations" was the winning choice.', 100);
        } else if (selectedOption === "Exceeds Expectations" || selectedOption === "Outstanding") {
          updateMessage('Too confident! Managers don\'t like employees who think too highly of themselves.');
          if (sendVoiceMessage) {
            sendVoiceMessage('Hmm, that seems a bit presumptuous. We prefer more modest self-assessments.');
          }
          endGame(false, 'Overconfidence penalty! Should have said "Meets Expectations".', 30);
        } else {
          updateMessage('Too modest! Why would we want to keep someone who rates themselves so low?');
          if (sendVoiceMessage) {
            sendVoiceMessage('That\'s concerning. We need employees who have confidence in their abilities.');
          }
          endGame(false, 'Too self-deprecating! "Meets Expectations" was the sweet spot.', 20);
        }
      }
    };
    
    onVoiceInput(handleVoiceInput);
  }, [isInitialized, onVoiceInput, hasAnswered, showEvaluation, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showEvaluation ? (
        <div className="text-center">
          <div className="text-8xl">📋</div>
          <p className="text-2xl mt-4">*HR preparing evaluation forms*</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-blue-400">
            <div className="text-6xl mb-4">👔</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-200">ANNUAL SELF-EVALUATION</h3>
            <div className="bg-white bg-opacity-90 rounded p-4 text-black mb-4">
              <p className="text-xl font-bold">Rate your: {category}</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {options.map((option, index) => (
                <div key={index} className="bg-gray-700 bg-opacity-50 rounded p-2">
                  {option}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Say one of the options above!
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Tip: Corporate politics matter. Choose wisely!</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>HR is reviewing your response...</p>
              <div className="text-4xl mt-2">📊</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EvaluateYourselfGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Evaluate Yourself"
      instructions="It's review time! Choose the RIGHT evaluation to keep your job!"
      duration={10}
      {...props}
    >
      <EvaluateYourselfGame />
    </BaseGame>
  );
}