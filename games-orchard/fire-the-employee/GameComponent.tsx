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

function FireTheEmployeeGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Select random employee to fire
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
    setCurrentEmployee(randomEmployee);
    
    updateMessage(`${randomEmployee.name} has entered your office...`);
    if (sendVoiceMessage) {
      sendVoiceMessage(`You're the boss and ${randomEmployee.name} has just walked into your office. You need to fire them for ${randomEmployee.issue}. Be firm, direct, and professional about it!`);
    }
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentEmployee) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        if (input.length > 20) { // Substantial firing speech
          setHasAnswered(true);
          
          // Firmness keywords
          const firmKeywords = ['fired', 'terminated', 'letting you go', 'dismissing', 'employment ends', 'your last day'];
          const reasonKeywords = ['late', 'performance', 'behavior', 'conduct', 'policy', 'violation', 'inappropriate'];
          const professionalKeywords = ['unfortunately', 'decision', 'effective', 'immediately', 'security', 'hr', 'benefits'];
          
          const isFirm = firmKeywords.some(keyword => input.includes(keyword));\n          const givesReason = reasonKeywords.some(keyword => input.includes(keyword));\n          const isProfessional = professionalKeywords.some(keyword => input.includes(keyword));\n          const isLong = input.length > 50;\n          const mentionsConsequences = input.includes('security') || input.includes('escort') || input.includes('immediately');\n          \n          let score = 0;\n          \n          // Scoring\n          if (isFirm) score += 40;\n          if (givesReason) score += 30;\n          if (isProfessional) score += 20;\n          if (isLong) score += 10;\n          if (mentionsConsequences) score += 15;\n          \n          // Negative points for being too harsh or unprofessional\n          const harshKeywords = ['hate', 'terrible', 'awful', 'worst', 'idiot', 'stupid'];\n          const isHarsh = harshKeywords.some(keyword => input.includes(keyword));\n          if (isHarsh) score -= 30;\n          \n          if (score >= 80) {\n            updateMessage('Perfect! You fired them with authority and professionalism!');\n            if (sendVoiceMessage) {\n              sendVoiceMessage(`Excellent! You handled that firing like a true boss - firm, clear, and professional. ${currentEmployee.name} knows exactly why they're being terminated and what happens next. HR would be proud!`);\n            }\n            endGame(true, 'Executive excellence! You fired them like a boss!', score);\n          } else if (score >= 50) {\n            updateMessage('Good job! You got the message across clearly.');\n            if (sendVoiceMessage) {\n              sendVoiceMessage(`Well done! You managed to fire ${currentEmployee.name} effectively. It wasn't perfect, but they understand they're terminated. A solid managerial performance.`);\n            }\n            endGame(true, 'Decent firing! You got the job done.', score);\n          } else {\n            updateMessage('That was... unclear. The employee looks confused.');\n            if (sendVoiceMessage) {\n              sendVoiceMessage(`Oh dear! ${currentEmployee.name} looks puzzled and isn't sure what just happened. Were they fired? Are they getting a promotion? You need to work on your termination technique!`);\n            }\n            endGame(false, 'Ineffective firing. The employee is confused.', Math.max(10, score));\n          }\n        }\n      };\n      \n      onVoiceInput(handleVoiceInput);\n    }\n  }, [onVoiceInput, hasAnswered, currentEmployee, endGame, updateMessage, sendVoiceMessage]);\n\n  if (!currentEmployee) {\n    return <div>An employee approaches your office...</div>;\n  }\n\n  return (\n    <div className=\"text-center max-w-2xl bg-gradient-to-br from-gray-200 via-blue-100 to-red-100 rounded-lg p-8\">\n      <div className=\"bg-white rounded-lg shadow-lg p-6 mb-6 border-4 border-gray-400\">\n        <h2 className=\"text-3xl font-bold mb-6 text-gray-800\">👔 Fire The Employee</h2>\n        \n        {/* Office setting */}\n        <div className=\"bg-gray-100 rounded-lg p-6 mb-6 border-2 border-gray-300\">\n          <div className=\"flex items-center justify-center mb-4\">\n            <div className=\"text-6xl mr-4\">👨‍💼</div>\n            <div className=\"text-8xl\">{currentEmployee.emoji}</div>\n            <div className=\"text-6xl ml-4\">🚪</div>\n          </div>\n          \n          <div className=\"text-center\">\n            <h3 className=\"text-2xl font-bold text-gray-700 mb-2\">\n              {currentEmployee.name} has entered your office\n            </h3>\n            <div className=\"text-sm text-gray-600 bg-yellow-100 border border-yellow-300 rounded p-3 mb-4\">\n              <strong>HR File:</strong> {currentEmployee.backstory}\n            </div>\n            <div className=\"text-red-600 font-bold\">\n              Reason for termination: {currentEmployee.issue}\n            </div>\n          </div>\n        </div>\n\n        {/* Boss instructions */}\n        <div className=\"bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4\">\n          <h4 className=\"text-lg font-bold text-red-800 mb-2\">🎯 Your Mission:</h4>\n          <ul className=\"text-sm text-red-700 text-left space-y-1\">\n            <li>• Be firm and direct</li>\n            <li>• State they are terminated</li>\n            <li>• Give the reason why</li>\n            <li>• Remain professional</li>\n            <li>• Mention next steps (security, HR, etc.)</li>\n          </ul>\n        </div>\n\n        {/* Voice input prompt */}\n        <div className=\"bg-blue-50 border-2 border-blue-200 rounded-lg p-4\">\n          <div className=\"text-3xl mb-2\">🎤</div>\n          <p className=\"text-lg font-semibold text-blue-800 mb-2\">\n            Fire {currentEmployee.name}!\n          </p>\n          <p className=\"text-sm text-blue-600\">\n            Be the boss and tell them they're terminated\n          </p>\n          \n          {hasAnswered && (\n            <div className=\"mt-4 text-blue-600\">\n              <div className=\"animate-spin text-2xl mb-2\">💼</div>\n              <p>HR is reviewing your termination...</p>\n            </div>\n          )}\n        </div>\n      </div>\n\n      {/* Office atmosphere */}\n      <div className=\"flex justify-center space-x-4 text-2xl opacity-50\">\n        <span className=\"animate-bounce\">📋</span>\n        <span className=\"animate-bounce\" style={{ animationDelay: '0.2s' }}>💼</span>\n        <span className=\"animate-bounce\" style={{ animationDelay: '0.4s' }}>🏢</span>\n        <span className=\"animate-bounce\" style={{ animationDelay: '0.6s' }}>👔</span>\n      </div>\n    </div>\n  );\n}\n\nexport default function FireTheEmployeeGameComponent(props: GameProps) {\n  return (\n    <BaseGame\n      title=\"Fire The Employee\"\n      instructions=\"You're the boss! Fire this problematic employee professionally!\"\n      duration={12}\n      {...props}\n    >\n      <FireTheEmployeeGame />\n    </BaseGame>\n  );\n}"