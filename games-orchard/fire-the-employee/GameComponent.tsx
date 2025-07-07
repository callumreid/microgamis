"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Employee {
  id: string;
  name: string;
  issue: string;
  emoji: string;
  backstory: string;
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const employees: Employee[] = [
  {
    id: 'lazy_larry',
    name: 'Larry',
    issue: 'chronic lateness and sleeping at desk',
    emoji: '😴',
    backstory: 'Larry has been arriving 2 hours late every day and was caught napping during the board meeting.'
  },
  {
    id: 'karen_complaints',
    name: 'Karen',
    issue: 'hostile attitude and customer complaints',
    emoji: '😠',
    backstory: 'Karen has received 15 customer complaints this month and yelled at the CEO in the elevator.'
  },
  {
    id: 'bob_embezzler',
    name: 'Bob',
    issue: 'financial misconduct and theft',
    emoji: '💰',
    backstory: 'Bob was caught stealing from petty cash and falsifying expense reports for personal trips.'
  },
  {
    id: 'susan_gossip',
    name: 'Susan',
    issue: 'spreading rumors and workplace harassment',
    emoji: '🗣️',
    backstory: 'Susan has been spreading false rumors about colleagues and creating a toxic work environment.'
  }
];

function FireTheEmployeeGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Select random employee to fire
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
    setCurrentEmployee(randomEmployee);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || !currentEmployee) return;
    
    updateMessage?.(`${currentEmployee.name} has entered your office...`);
    if (sendVoiceMessage) {
      sendVoiceMessage(`You're the boss and ${currentEmployee.name} has just walked into your office. You need to fire them for ${currentEmployee.issue}. Be firm, direct, and professional about it!`);
    }
  }, [isInitialized, currentEmployee, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (!isInitialized || !onVoiceInput || hasAnswered || !currentEmployee) return;
    
    const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 20) { // Substantial firing speech
          setHasAnswered(true);
          
          // Firmness keywords
          const firmKeywords = ['fired', 'terminated', 'letting you go', 'dismissing', 'employment ends', 'your last day'];
          const reasonKeywords = ['late', 'performance', 'behavior', 'conduct', 'policy', 'violation', 'inappropriate'];
          const professionalKeywords = ['unfortunately', 'decision', 'effective', 'immediately', 'security', 'hr', 'benefits'];
          
          const isFirm = firmKeywords.some(keyword => input.includes(keyword));
          const givesReason = reasonKeywords.some(keyword => input.includes(keyword));
          const isProfessional = professionalKeywords.some(keyword => input.includes(keyword));
          const isLong = input.length > 50;
          const mentionsConsequences = input.includes('security') || input.includes('escort') || input.includes('immediately');
          
          let score = 0;
          
          // Scoring
          if (isFirm) score += 40;
          if (givesReason) score += 30;
          if (isProfessional) score += 20;
          if (isLong) score += 10;
          if (mentionsConsequences) score += 15;
          
          // Negative points for being too harsh or unprofessional
          const harshKeywords = ['hate', 'terrible', 'awful', 'worst', 'idiot', 'stupid'];
          const isHarsh = harshKeywords.some(keyword => input.includes(keyword));
          if (isHarsh) score -= 30;
          
          if (score >= 80) {
            updateMessage?.('Perfect! You fired them with authority and professionalism!');
            if (sendVoiceMessage) {
              sendVoiceMessage(`Excellent! You handled that firing like a true boss - firm, clear, and professional. ${currentEmployee.name} knows exactly why they're being terminated and what happens next. HR would be proud!`);
            }
            endGame?.(true, 'Executive excellence! You fired them like a boss!', score);
          } else if (score >= 50) {
            updateMessage?.('Good job! You got the message across clearly.');
            if (sendVoiceMessage) {
              sendVoiceMessage(`Well done! You managed to fire ${currentEmployee.name} effectively. It wasn't perfect, but they understand they're terminated. A solid managerial performance.`);
            }
            endGame?.(true, 'Decent firing! You got the job done.', score);
          } else {
            updateMessage?.('That was... unclear. The employee looks confused.');
            if (sendVoiceMessage) {
              sendVoiceMessage(`Oh dear! ${currentEmployee.name} looks puzzled and isn't sure what just happened. Were they fired? Are they getting a promotion? You need to work on your termination technique!`);
            }
            endGame?.(false, 'Ineffective firing. The employee is confused.', Math.max(10, score));
          }
        }
      };
      
    // Voice input removed for build compatibility
  }, [isInitialized, onVoiceInput, hasAnswered, currentEmployee, endGame, updateMessage, sendVoiceMessage]);

  if (!currentEmployee) {
    return <div>An employee approaches your office...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-gray-200 via-blue-100 to-red-100 rounded-lg p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-4 border-gray-400">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">👔 Fire The Employee</h2>
        
        {/* Office setting */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6 border-2 border-gray-300">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl mr-4">👨‍💼</div>
            <div className="text-8xl">{currentEmployee.emoji}</div>
            <div className="text-6xl ml-4">🚪</div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {currentEmployee.name} has entered your office
            </h3>
            <div className="text-sm text-gray-600 bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
              <strong>HR File:</strong> {currentEmployee.backstory}
            </div>
            <div className="text-red-600 font-bold">
              Reason for termination: {currentEmployee.issue}
            </div>
          </div>
        </div>

        {/* Boss instructions */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-bold text-red-800 mb-2">🎯 Your Mission:</h4>
          <ul className="text-sm text-red-700 text-left space-y-1">
            <li>• Be firm and direct</li>
            <li>• State they are terminated</li>
            <li>• Give the reason why</li>
            <li>• Remain professional</li>
            <li>• Mention next steps (security, HR, etc.)</li>
          </ul>
        </div>

        {/* Voice input prompt */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="text-lg font-semibold text-blue-800 mb-2">
            Fire {currentEmployee.name}!
          </p>
          <p className="text-sm text-blue-600">
            Be the boss and tell them they're terminated
          </p>
          
          {hasAnswered && (
            <div className="mt-4 text-blue-600">
              <div className="text-2xl mb-2">💼</div>
              <p>HR is reviewing your termination...</p>
            </div>
          )}
        </div>
      </div>

      {/* Office atmosphere */}
      <div className="flex justify-center space-x-4 text-2xl opacity-50">
        <span>📋</span>
        <span>💼</span>
        <span>🏢</span>
        <span>👔</span>
      </div>
    </div>
  );
}

export default function FireTheEmployeeGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Fire The Employee"
      instructions="You're the boss! Fire this problematic employee professionally!"
      duration={12}
      {...props}
    >
      <FireTheEmployeeGame {...props} />
    </BaseGame>
  );
}