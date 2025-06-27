"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

type CupChoice = 'left' | 'right';

function PickTheNotPoisonGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [poisonCup, setPoisonCup] = useState<CupChoice>('left');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userChoice, setUserChoice] = useState<CupChoice | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [magicianAnimation, setMagicianAnimation] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game data once
  useEffect(() => {
    if (!isInitialized) {
      // Randomly choose which cup has poison
      const cups: CupChoice[] = ['left', 'right'];
      const randomPoison = cups[Math.floor(Math.random() * cups.length)];
      setPoisonCup(randomPoison);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle game setup and animation
  useEffect(() => {
    if (isInitialized) {
      updateMessage('A mysterious magician offers you two cups...');
      if (sendVoiceMessage) {
        sendVoiceMessage('Welcome, brave soul! I am a mysterious magician, and before you are two identical cups. One contains a delicious potion of victory, the other... deadly poison! Choose wisely - your fate depends on it!');
      }

      // Magician animation
      const animationTimer = setInterval(() => {
        setMagicianAnimation(prev => (prev + 1) % 4);
      }, 500);

      return () => clearInterval(animationTimer);
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        let choice: CupChoice | null = null;
        
        if (input.includes('left')) {
          choice = 'left';
        } else if (input.includes('right')) {
          choice = 'right';
        }
        
        if (choice) {
          setHasAnswered(true);
          setUserChoice(choice);
          
          updateMessage('You reach for the cup...');
          if (sendVoiceMessage) {
            sendVoiceMessage(`Ah, you have chosen the ${choice} cup! Let us see if fate smiles upon you...`);
          }
          
          // Dramatic pause before revealing result
          setTimeout(() => {
            setRevealed(true);
            
            if (choice === poisonCup) {
              updateMessage('💀 POISON! You chose poorly! 💀');
              if (sendVoiceMessage) {
                sendVoiceMessage('OH NO! You have chosen... POORLY! The cup contained deadly poison! Your adventure ends here, but fear not - in the world of magic, death is but an illusion!');
              }
              
              if (playSound) {
                playSound('poison-death');
              }
              
              setTimeout(() => {
                endGame(false, 'You picked the poisoned cup! Choose more carefully next time.', 0);
              }, 2000);
            } else {
              updateMessage('🏆 VICTORY! You chose the safe cup! 🏆');
              if (sendVoiceMessage) {
                sendVoiceMessage('EXCELLENT CHOICE! You have chosen wisely! The cup contains the sweet nectar of victory! You have outwitted the magician and live to tell the tale!');
              }
              
              if (playSound) {
                playSound('magic-success');
              }
              
              setTimeout(() => {
                endGame(true, 'Wise choice! You avoided the poison and found victory!', 100);
              }, 2000);
            }\n          }, 2000);\n        }\n      };\n      \n      onVoiceInput(handleVoiceInput);\n    }\n  }, [onVoiceInput, hasAnswered, poisonCup, endGame, updateMessage, sendVoiceMessage, playSound]);\n\n  const getMagicianEmoji = () => {\n    const animations = ['🧙‍♂️', '✨🧙‍♂️', '🧙‍♂️✨', '✨🧙‍♂️✨'];\n    return animations[magicianAnimation];\n  };\n\n  return (\n    <div className=\"w-full h-full relative bg-gradient-to-br from-purple-900 via-indigo-800 to-black flex items-center justify-center overflow-hidden\">\n      {/* Magical atmosphere */}\n      <div className=\"absolute inset-0\">\n        {/* Stars */}\n        {Array.from({ length: 30 }).map((_, i) => (\n          <div\n            key={i}\n            className=\"absolute text-yellow-300 animate-twinkle\"\n            style={{\n              left: `${Math.random() * 100}%`,\n              top: `${Math.random() * 100}%`,\n              animationDelay: `${Math.random() * 3}s`,\n              fontSize: `${0.5 + Math.random() * 0.5}rem`,\n            }}\n          >\n            ⭐\n          </div>\n        ))}\n        \n        {/* Floating magical elements */}\n        <div className=\"absolute top-10 left-10 text-2xl animate-float\">🔮</div>\n        <div className=\"absolute top-20 right-20 text-xl animate-float-delayed\">✨</div>\n        <div className=\"absolute bottom-20 left-20 text-2xl animate-float\">🎩</div>\n        <div className=\"absolute bottom-10 right-10 text-xl animate-float-delayed\">🪄</div>\n      </div>\n\n      <div className=\"relative z-10 bg-black bg-opacity-60 rounded-lg border-4 border-purple-400 p-8 max-w-lg text-center\">\n        {/* Magician */}\n        <div className=\"mb-6\">\n          <div className=\"text-6xl mb-2\">{getMagicianEmoji()}</div>\n          <h2 className=\"text-2xl font-bold text-purple-200 mb-2\">The Mysterious Magician</h2>\n          <p className=\"text-purple-300 text-sm italic\">\n            \"Choose wisely, mortal...\"\n          </p>\n        </div>\n\n        {/* The Challenge */}\n        <div className=\"bg-purple-800 bg-opacity-50 rounded-lg p-6 mb-6 border-2 border-purple-500\">\n          <h3 className=\"text-xl font-bold text-white mb-4\">☠️ The Deadly Choice ☠️</h3>\n          <p className=\"text-purple-200 text-sm mb-4\">\n            Two cups before you lie. One holds victory, one holds doom.\n          </p>\n          \n          {/* The Cups */}\n          <div className=\"flex justify-center space-x-8 mb-4\">\n            <div className={`text-center ${userChoice === 'left' ? 'transform scale-110' : ''} transition-transform`}>\n              <div className=\"text-4xl mb-2\">🏺</div>\n              <div className=\"text-white font-bold\">LEFT CUP</div>\n              {revealed && poisonCup === 'left' && (\n                <div className=\"text-green-400 text-xs mt-1\">💀 POISON!</div>\n              )}\n              {revealed && poisonCup !== 'left' && (\n                <div className=\"text-gold-400 text-xs mt-1\">🏆 SAFE!</div>\n              )}\n            </div>\n            \n            <div className={`text-center ${userChoice === 'right' ? 'transform scale-110' : ''} transition-transform`}>\n              <div className=\"text-4xl mb-2\">🏺</div>\n              <div className=\"text-white font-bold\">RIGHT CUP</div>\n              {revealed && poisonCup === 'right' && (\n                <div className=\"text-green-400 text-xs mt-1\">💀 POISON!</div>\n              )}\n              {revealed && poisonCup !== 'right' && (\n                <div className=\"text-gold-400 text-xs mt-1\">🏆 SAFE!</div>\n              )}\n            </div>\n          </div>\n        </div>\n\n        {/* Instructions */}\n        {!hasAnswered && (\n          <div className=\"bg-red-900 bg-opacity-50 border-2 border-red-400 rounded p-4\">\n            <div className=\"text-3xl mb-2\">🎤</div>\n            <p className=\"text-red-200 font-bold text-lg mb-2\">\n              Make your choice!\n            </p>\n            <p className=\"text-red-300 text-sm\">\n              Say \"left\" or \"right\" to choose your cup\n            </p>\n          </div>\n        )}\n\n        {/* Suspense */}\n        {hasAnswered && !revealed && (\n          <div className=\"bg-yellow-800 bg-opacity-50 border-2 border-yellow-400 rounded p-4\">\n            <div className=\"text-3xl mb-2 animate-pulse\">⏳</div>\n            <p className=\"text-yellow-200 font-bold\">\n              The moment of truth approaches...\n            </p>\n          </div>\n        )}\n\n        {/* Result */}\n        {revealed && (\n          <div className={`border-2 rounded p-4 ${userChoice !== poisonCup ? 'bg-green-800 bg-opacity-50 border-green-400' : 'bg-red-800 bg-opacity-50 border-red-400'}`}>\n            <div className=\"text-4xl mb-2\">\n              {userChoice !== poisonCup ? '🏆' : '💀'}\n            </div>\n            <p className=\"text-white font-bold text-lg\">\n              {userChoice !== poisonCup ? 'VICTORY!' : 'DOOM!'}\n            </p>\n            <p className=\"text-gray-300 text-sm\">\n              The {poisonCup} cup contained poison\n            </p>\n          </div>\n        )}\n      </div>\n\n      <style jsx>{`\n        @keyframes twinkle {\n          0%, 100% { opacity: 0.3; transform: scale(0.8); }\n          50% { opacity: 1; transform: scale(1.2); }\n        }\n        @keyframes float {\n          0%, 100% { transform: translateY(0px) rotate(0deg); }\n          50% { transform: translateY(-15px) rotate(10deg); }\n        }\n        @keyframes float-delayed {\n          0%, 100% { transform: translateY(0px) rotate(0deg); }\n          50% { transform: translateY(-10px) rotate(-10deg); }\n        }\n        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }\n        .animate-float { animation: float 4s ease-in-out infinite; }\n        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }\n      `}</style>\n    </div>\n  );\n}\n\nexport default function PickTheNotPoisonGameComponent(props: GameProps) {\n  return (\n    <BaseGame\n      title=\"Pick The Not Poison\"\n      instructions=\"Choose wisely - one cup contains victory, the other death!\"\n      duration={10}\n      {...props}\n    >\n      <PickTheNotPoisonGame />\n    </BaseGame>\n  );\n}"