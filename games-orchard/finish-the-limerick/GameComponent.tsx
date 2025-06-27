"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Limerick {
  id: string;
  lines: [string, string, string];
  theme: string;
  rhymeScheme: string;
  hints: string[];
}

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

const limericks: Limerick[] = [
  {
    id: 'cat_hat',
    lines: [
      'There once was a cat with a hat',
      'Who sat on a very large mat',
      'He looked quite divine'
    ],
    theme: 'cat',
    rhymeScheme: 'hat/mat/that',
    hints: ['Something the cat did', 'Rhymes with hat/mat', 'Past tense action']
  },
  {
    id: 'frog_log',
    lines: [
      'A frog who lived under a log',
      'Got lost in the thickest of fog',
      'He croaked with great fright'
    ],
    theme: 'frog',
    rhymeScheme: 'log/fog/dog',
    hints: ['What happened next', 'Rhymes with log/fog', 'Something about dogs']
  },
  {
    id: 'mouse_house',
    lines: [
      'A mouse built a tiny small house',
      'And invited his friend, a small grouse',
      'They danced through the night'
    ],
    theme: 'mouse',
    rhymeScheme: 'house/grouse/louse',
    hints: ['What was the result', 'Rhymes with house/grouse', 'Something small']
  },
  {
    id: 'bear_chair',
    lines: [
      'A bear sat down in a small chair',
      'And got his big bottom stuck there',
      'He wiggled about'
    ],
    theme: 'bear',
    rhymeScheme: 'chair/there/care',
    hints: ['What did others do', 'Rhymes with chair/there', 'Showing concern']
  }
];

function FinishTheLimerickGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentLimerick, setCurrentLimerick] = useState<Limerick | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Select random limerick
    const randomLimerick = limericks[Math.floor(Math.random() * limericks.length)];
    setCurrentLimerick(randomLimerick);
    
    updateMessage('A leprechaun has started a limerick! Finish it!');\n    if (sendVoiceMessage) {\n      sendVoiceMessage(`Top o' the morning! A merry leprechaun has started a limerick and needs your help finishing it! Listen to the first three lines and complete the poem with two more lines!`);\n    }\n\n    // Show hint after 6 seconds\n    const hintTimer = setTimeout(() => {\n      setShowHint(true);\n      updateMessage('Need a hint? Think about the rhyme scheme!');\n      if (sendVoiceMessage) {\n        sendVoiceMessage(`Here's a wee hint: your last two lines should rhyme with the first two, and remember limericks are meant to be funny!`);\n      }\n    }, 6000);\n\n    return () => clearTimeout(hintTimer);\n  }, [updateMessage, sendVoiceMessage]);\n\n  useEffect(() => {\n    if (onVoiceInput && !hasAnswered && currentLimerick) {\n      const handleVoiceInput = (transcript: string) => {\n        const input = transcript.toLowerCase().trim();\n        \n        if (input.length > 30) { // Substantial completion attempt\n          setHasAnswered(true);\n          \n          // Check for rhyming attempts\n          const rhymeWords = currentLimerick.rhymeScheme.split('/');\n          const hasRhyme = rhymeWords.some(word => input.includes(word));\n          \n          // Check for completion structure (two lines)\n          const lineCount = input.split('.').length + input.split('!').length + input.split('?').length;\n          const hasMultipleLines = lineCount >= 2 || input.includes(' and ') || input.includes(' then ');\n          \n          // Check for humor/creativity\n          const humorWords = ['funny', 'silly', 'laugh', 'giggle', 'joke', 'amusing', 'witty'];\n          const isCreative = input.length > 50;\n          const mentions Theme = input.includes(currentLimerick.theme);\n          \n          let score = 0;\n          \n          // Scoring criteria\n          if (hasRhyme) score += 40;\n          if (hasMultipleLines) score += 30;\n          if (isCreative) score += 20;\n          if (mentionsTheme) score += 10;\n          \n          if (score >= 70) {\n            updateMessage('Brilliant! The leprechaun loves your limerick!');\n            if (sendVoiceMessage) {\n              sendVoiceMessage('Ah, that\\'s a beautiful limerick indeed! The leprechaun is so pleased, he\\'s doing a little jig! You\\'ve got the gift of poetry, you do!');\n            }\n            endGame(true, 'Poetic genius! The leprechaun approves!', score);\n          } else if (score >= 40) {\n            updateMessage('Not bad! The leprechaun chuckles at your attempt.');\n            if (sendVoiceMessage) {\n              sendVoiceMessage('Ah, not bad at all! The leprechaun gives you a wee smile. Your limerick has potential, but could use a bit more Irish magic!');\n            }\n            endGame(true, 'Decent poetry! Room for improvement.', score);\n          } else {\n            updateMessage('The leprechaun scratches his head in confusion...');\n            if (sendVoiceMessage) {\n              sendVoiceMessage('Oh dear, the leprechaun is quite puzzled by your words! Perhaps you need to study the art of limerick writing a bit more!');\n            }\n            endGame(false, 'The leprechaun doesn\\'t understand your poetry.', Math.max(10, score));\n          }\n        }\n      };\n      \n      onVoiceInput(handleVoiceInput);\n    }\n  }, [onVoiceInput, hasAnswered, currentLimerick, endGame, updateMessage, sendVoiceMessage]);\n\n  if (!currentLimerick) {\n    return <div>A leprechaun approaches...</div>;\n  }\n\n  return (\n    <div className=\"text-center max-w-2xl bg-gradient-to-br from-green-200 via-emerald-300 to-green-400 rounded-lg p-8 relative overflow-hidden\">\n      {/* Irish decorations */}\n      <div className=\"absolute top-4 right-4 text-3xl animate-bounce\">🍀</div>\n      <div className=\"absolute bottom-4 left-4 text-2xl animate-bounce\" style={{ animationDelay: '0.5s' }}>🌈</div>\n      <div className=\"absolute top-4 left-4 text-2xl animate-bounce\" style={{ animationDelay: '1s' }}>🎩</div>\n      \n      <div className=\"bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-6 border-4 border-green-600\">\n        <div className=\"flex items-center justify-center mb-4\">\n          <div className=\"text-4xl mr-3\">🧙‍♂️</div>\n          <h2 className=\"text-3xl font-bold text-green-800\">Finish The Limerick!</h2>\n          <div className=\"text-4xl ml-3\">🇮🇪</div>\n        </div>\n        \n        {/* Limerick display */}\n        <div className=\"bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6\">\n          <div className=\"text-lg font-serif text-green-800 space-y-2\">\n            {currentLimerick.lines.map((line, index) => (\n              <div key={index} className=\"text-left\">\n                <span className=\"font-bold text-green-600\">{index + 1}.</span> {line}\n              </div>\n            ))}\n            <div className=\"text-gray-500 italic mt-4\">\n              <div>4. _______________</div>\n              <div>5. _______________</div>\n            </div>\n          </div>\n        </div>\n\n        {/* Hint section */}\n        {showHint && (\n          <div className=\"bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4\">\n            <div className=\"text-2xl mb-2\">💡</div>\n            <p className=\"text-md font-semibold text-yellow-800 mb-2\">\n              Limerick Tips:\n            </p>\n            <ul className=\"text-sm text-yellow-700 text-left space-y-1\">\n              <li>• Lines 4 & 5 should rhyme with lines 1 & 2</li>\n              <li>• Make it funny or surprising!</li>\n              <li>• Keep the rhythm bouncy</li>\n            </ul>\n          </div>\n        )}\n\n        {/* Voice input prompt */}\n        <div className=\"bg-green-100 border-2 border-green-400 rounded-lg p-4\">\n          <div className=\"text-3xl mb-2\">🎤</div>\n          <p className=\"text-lg font-semibold text-green-800 mb-2\">\n            Complete the limerick!\n          </p>\n          <p className=\"text-sm text-green-600\">\n            Speak the final two lines to finish the poem\n          </p>\n          \n          {hasAnswered && (\n            <div className=\"mt-4 text-green-600\">\n              <div className=\"animate-spin text-2xl mb-2\">🍀</div>\n              <p>The leprechaun is listening...</p>\n            </div>\n          )}\n        </div>\n      </div>\n\n      {/* Irish atmosphere */}\n      <div className=\"flex justify-center space-x-4 text-2xl opacity-60\">\n        <span className=\"animate-float\">🍀</span>\n        <span className=\"animate-float\" style={{ animationDelay: '0.3s' }}>🎵</span>\n        <span className=\"animate-float\" style={{ animationDelay: '0.6s' }}>📝</span>\n        <span className=\"animate-float\" style={{ animationDelay: '0.9s' }}>🌈</span>\n      </div>\n\n      <style jsx>{`\n        @keyframes float {\n          0%, 100% { transform: translateY(0px); }\n          50% { transform: translateY(-10px); }\n        }\n        .animate-float { animation: float 3s ease-in-out infinite; }\n      `}</style>\n    </div>\n  );\n}\n\nexport default function FinishTheLimerickGameComponent(props: GameProps) {\n  return (\n    <BaseGame\n      title=\"Finish The Limerick\"\n      instructions=\"Help the leprechaun complete his Irish limerick!\"\n      duration={12}\n      {...props}\n    >\n      <FinishTheLimerickGame />\n    </BaseGame>\n  );\n}"