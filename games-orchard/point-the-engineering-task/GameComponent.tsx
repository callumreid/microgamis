"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const tasks = [
  "Add a login button to the homepage",
  "Fix the broken search functionality", 
  "Implement user profile page",
  "Optimize database queries for faster loading",
  "Refactor the authentication system",
  "Add email notifications for new messages",
  "Create responsive mobile layout",
  "Integrate third-party payment system"
];

const fibonacciScale = [1, 2, 3, 5, 8, 13, 21];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
}

function PointTaskGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage }: GameControlProps) {
  const [currentTask, setCurrentTask] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setCurrentTask(randomTask);
    updateMessage(`Point this task using Fibonacci scale: "${randomTask}"`);
    
    if (sendVoiceMessage) {
      sendVoiceMessage(`Point this engineering task: ${randomTask}. Say a number from the Fibonacci scale: 1, 2, 3, 5, 8, 13, or 21.`);
    }
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        const pointValue = parseFloat(input);
        
        if (fibonacciScale.includes(pointValue)) {
          setHasAnswered(true);
          if (pointValue === 2) {
            endGame(true, `Correct! ${pointValue} points is the right estimate.`, 100);
          } else {
            endGame(false, `You said ${pointValue}. The correct answer was 2 points!`, 0);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, endGame]);

  return (
    <div className="text-center max-w-2xl">
      <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4">Engineering Task</h3>
        <p className="text-xl mb-6">"{currentTask}"</p>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Fibonacci Scale:</h4>
          <div className="flex justify-center space-x-2">
            {fibonacciScale.map(num => (
              <span key={num} className="bg-blue-500 px-3 py-1 rounded text-white font-bold">
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-lg">
        🎤 Say your point estimate out loud!
      </p>
      
      {hasAnswered && (
        <div className="mt-4 text-yellow-300">
          <p>Processing your answer...</p>
        </div>
      )}
    </div>
  );
}

export default function PointEngineeringTaskGame(props: GameProps) {
  return (
    <BaseGame
      title="Point the Engineering Task"
      instructions="Estimate the complexity using Fibonacci scale. Say '2' to win!"
      duration={10}
      {...props}
    >
      <PointTaskGame />
    </BaseGame>
  );
}