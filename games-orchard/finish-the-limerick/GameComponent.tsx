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

function FinishTheLimerickGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [currentLimerick, setCurrentLimerick] = useState<Limerick | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Select random limerick
    const randomLimerick = limericks[Math.floor(Math.random() * limericks.length)];
    setCurrentLimerick(randomLimerick);
    
    updateMessage?.('A leprechaun has started a limerick! Finish it!');
    if (sendVoiceMessage) {
      sendVoiceMessage(`Top o' the morning! A merry leprechaun has started a limerick and needs your help finishing it! Listen to the first three lines and complete the poem with two more lines!`);
    }

    // Show hint after 6 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      updateMessage?.('Need a hint? Think about the rhyme scheme!');
      if (sendVoiceMessage) {
        sendVoiceMessage(`Here's a wee hint: your last two lines should rhyme with the first two, and remember limericks are meant to be funny!`);
      }
    }, 6000);

    return () => clearTimeout(hintTimer);
  }, [updateMessage, sendVoiceMessage]);

  const handleLimerickSubmit = () => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    
    // Placeholder scoring - just give a good score
    const score = 85;
    
    updateMessage?.('Brilliant! The leprechaun loves your limerick!');
    if (sendVoiceMessage) {
      sendVoiceMessage('Ah, that\'s a beautiful limerick indeed! The leprechaun is so pleased, he\'s doing a little jig! You\'ve got the gift of poetry, you do!');
    }
    endGame?.(true, 'Poetic genius! The leprechaun approves!', score);
  };

  if (!currentLimerick) {
    return <div>A leprechaun approaches...</div>;
  }

  return (
    <div className="text-center max-w-2xl bg-gradient-to-br from-green-200 via-emerald-300 to-green-400 rounded-lg p-8 relative overflow-hidden">
      {/* Irish decorations */}
      <div className="absolute top-4 right-4 text-3xl animate-bounce">🍀</div>
      <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌈</div>
      <div className="absolute top-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🎩</div>
      
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-6 border-4 border-green-600">
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">🧙‍♂️</div>
          <h2 className="text-3xl font-bold text-green-800">Finish The Limerick!</h2>
          <div className="text-4xl ml-3">🇮🇪</div>
        </div>
        
        {/* Limerick display */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
          <div className="text-lg font-serif text-green-800 space-y-2">
            {currentLimerick.lines.map((line, index) => (
              <div key={index} className="text-left">
                <span className="font-bold text-green-600">{index + 1}.</span> {line}
              </div>
            ))}
            <div className="text-gray-500 italic mt-4">
              <div>4. _______________</div>
              <div>5. _______________</div>
            </div>
          </div>
        </div>

        {/* Hint section */}
        {showHint && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-md font-semibold text-yellow-800 mb-2">
              Limerick Tips:
            </p>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• Lines 4 & 5 should rhyme with lines 1 & 2</li>
              <li>• Make it funny or surprising!</li>
              <li>• Keep the rhythm bouncy</li>
            </ul>
          </div>
        )}

        {/* Voice input prompt */}
        <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="text-lg font-semibold text-green-800 mb-2">
            Complete the limerick!
          </p>
          <p className="text-sm text-green-600 mb-4">
            Write the final two lines to finish the poem
          </p>
          
          {!hasAnswered && (
            <div className="space-y-3">
              <textarea 
                className="w-full p-3 border border-green-300 rounded resize-none"
                rows={3}
                placeholder="Write the final two lines here..."
              />
              <button 
                onClick={handleLimerickSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
              >
                Submit Limerick
              </button>
            </div>
          )}
          
          {hasAnswered && (
            <div className="mt-4 text-green-600">
              <div className="animate-spin text-2xl mb-2">🍀</div>
              <p>The leprechaun is listening...</p>
            </div>
          )}
        </div>
      </div>

      {/* Irish atmosphere */}
      <div className="flex justify-center space-x-4 text-2xl opacity-60">
        <span className="animate-float">🍀</span>
        <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎵</span>
        <span className="animate-float" style={{ animationDelay: '0.6s' }}>📝</span>
        <span className="animate-float" style={{ animationDelay: '0.9s' }}>🌈</span>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function FinishTheLimerickGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Finish The Limerick"
      instructions="Help the leprechaun complete his Irish limerick!"
      duration={12}
      {...props}
    >
      <FinishTheLimerickGame />
    </BaseGame>
  );
}