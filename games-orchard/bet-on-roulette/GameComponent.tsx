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

type BetType = 'red' | 'black' | 'green';
type RouletteNumber = {
  number: number;
  color: BetType;
};

const rouletteNumbers: RouletteNumber[] = [
  { number: 0, color: 'green' }, { number: 00, color: 'green' },
  { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' }, { number: 4, color: 'black' },
  { number: 5, color: 'red' }, { number: 6, color: 'black' }, { number: 7, color: 'red' }, { number: 8, color: 'black' },
  { number: 9, color: 'red' }, { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'red' },
  { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' }, { number: 16, color: 'red' },
  { number: 17, color: 'black' }, { number: 18, color: 'red' }, { number: 19, color: 'red' }, { number: 20, color: 'black' },
  { number: 21, color: 'red' }, { number: 22, color: 'black' }, { number: 23, color: 'red' }, { number: 24, color: 'black' },
  { number: 25, color: 'red' }, { number: 26, color: 'black' }, { number: 27, color: 'red' }, { number: 28, color: 'black' },
  { number: 29, color: 'black' }, { number: 30, color: 'red' }, { number: 31, color: 'black' }, { number: 32, color: 'red' },
  { number: 33, color: 'black' }, { number: 34, color: 'red' }, { number: 35, color: 'black' }, { number: 36, color: 'red' },
];

function BetOnRouletteGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<RouletteNumber | null>(null);
  const [userBet, setUserBet] = useState<BetType | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [wheelPosition, setWheelPosition] = useState(0);

  useEffect(() => {
    updateMessage('Place your bet! Red, black, or green?');
    if (sendVoiceMessage) {
      sendVoiceMessage('Welcome to the roulette table! The wheel is about to spin. Place your bet now - will it land on red, black, or green? Choose wisely!');
    }

    // Start spinning animation immediately
    const spinTimer = setInterval(() => {
      setWheelPosition(prev => (prev + 10) % 360);
    }, 50);

    // Stop after a few seconds and get result
    setTimeout(() => {
      clearInterval(spinTimer);
      setSpinning(false);
      
      const randomResult = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
      setResult(randomResult);
      
      if (userBet) {
        checkResult(randomResult, userBet);
      } else {
        updateMessage(`No bet placed! The ball landed on ${randomResult.color} ${randomResult.number}`);
        if (sendVoiceMessage) {
          sendVoiceMessage(`Oh no! You didn't place a bet in time! The ball landed on ${randomResult.color} ${randomResult.number}. Better luck next time!`);
        }
        endGame(false, 'No bet placed in time!', 0);
      }
    }, 6000);

    return () => clearInterval(spinTimer);
  }, [updateMessage, sendVoiceMessage]);

  const checkResult = (gameResult: RouletteNumber, bet: BetType) => {
    const won = gameResult.color === bet;
    const payout = bet === 'green' ? 35 : 2; // Green pays more but is rarer
    
    if (won) {
      updateMessage(`Winner! ${gameResult.color.toUpperCase()} ${gameResult.number}! You won!`);
      if (sendVoiceMessage) {
        sendVoiceMessage(`Congratulations! The ball landed on ${gameResult.color} ${gameResult.number} and you bet on ${bet}! You're a winner!`);
      }
      
      if (playSound) {
        playSound('casino-win');
      }
      
      const score = bet === 'green' ? 100 : 75; // Higher score for riskier green bet
      endGame(true, `Lucky winner! Ball landed on ${gameResult.color}!`, score);
    } else {
      updateMessage(`House wins! ${gameResult.color.toUpperCase()} ${gameResult.number}. You bet ${bet}.`);
      if (sendVoiceMessage) {
        sendVoiceMessage(`Sorry! The ball landed on ${gameResult.color} ${gameResult.number}, but you bet on ${bet}. The house always wins... eventually!`);
      }
      endGame(false, `Lost the bet! Ball was ${gameResult.color}, you bet ${bet}`, 0);
    }
  };

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && !result) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        let bet: BetType | null = null;
        
        if (input.includes('red')) {
          bet = 'red';
        } else if (input.includes('black')) {
          bet = 'black';
        } else if (input.includes('green')) {
          bet = 'green';
        }
        
        if (bet && !userBet) {
          setUserBet(bet);
          setHasAnswered(true);
          updateMessage(`Bet placed on ${bet.toUpperCase()}! Wheel is spinning...`);
          if (sendVoiceMessage) {
            sendVoiceMessage(`Your bet is on ${bet}! The wheel is spinning, the ball is bouncing... let's see where it lands!`);
          }
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, result, userBet, sendVoiceMessage, updateMessage]);

  return (
    <div className=\"w-full h-full relative bg-gradient-to-br from-green-800 via-green-600 to-green-900 flex items-center justify-center\">\n      {/* Casino atmosphere */}\n      <div className=\"absolute top-4 left-4 text-3xl animate-pulse\">💰</div>\n      <div className=\"absolute top-4 right-4 text-3xl animate-pulse\" style={{ animationDelay: '0.5s' }}>🎰</div>\n      <div className=\"absolute bottom-4 left-4 text-2xl animate-bounce\">🃏</div>\n      <div className=\"absolute bottom-4 right-4 text-2xl animate-bounce\" style={{ animationDelay: '0.3s' }}>🎲</div>\n\n      <div className=\"bg-white rounded-lg shadow-2xl p-8 max-w-md border-4 border-yellow-400\">\n        <h2 className=\"text-3xl font-bold mb-6 text-center text-gray-800\">🎡 Roulette Table</h2>\n        \n        {/* Roulette wheel */}\n        <div className=\"flex justify-center mb-6\">\n          <div \n            className=\"w-32 h-32 rounded-full border-8 border-yellow-600 bg-gradient-to-br from-red-500 via-black to-green-500 flex items-center justify-center relative\"\n            style={{ transform: `rotate(${wheelPosition}deg)` }}\n          >\n            {/* Wheel segments */}\n            <div className=\"absolute inset-2 rounded-full border-4 border-white bg-gray-800\">\n              <div className=\"w-full h-full flex items-center justify-center text-white font-bold\">\n                {result ? result.number : '🎯'}\n              </div>\n            </div>\n            \n            {/* Ball */}\n            <div className=\"absolute top-1 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2\"></div>\n          </div>\n        </div>\n\n        {/* Betting area */}\n        <div className=\"grid grid-cols-3 gap-2 mb-6\">\n          <div className={`bg-red-500 text-white p-4 rounded text-center font-bold cursor-pointer ${userBet === 'red' ? 'ring-4 ring-yellow-400' : ''}`}>\n            RED\n            <div className=\"text-xs mt-1\">Pays 2:1</div>\n          </div>\n          <div className={`bg-black text-white p-4 rounded text-center font-bold cursor-pointer ${userBet === 'black' ? 'ring-4 ring-yellow-400' : ''}`}>\n            BLACK\n            <div className=\"text-xs mt-1\">Pays 2:1</div>\n          </div>\n          <div className={`bg-green-500 text-white p-4 rounded text-center font-bold cursor-pointer ${userBet === 'green' ? 'ring-4 ring-yellow-400' : ''}`}>\n            GREEN\n            <div className=\"text-xs mt-1\">Pays 35:1</div>\n          </div>\n        </div>\n\n        {/* Voice instructions */}\n        {!hasAnswered && !result && (\n          <div className=\"bg-yellow-100 border border-yellow-400 rounded p-3 text-center\">\n            <div className=\"text-2xl mb-2\">🎤</div>\n            <p className=\"text-sm font-semibold text-yellow-800\">\n              Say \"red\", \"black\", or \"green\" to place your bet!\n            </p>\n          </div>\n        )}\n\n        {/* Current bet display */}\n        {userBet && (\n          <div className=\"bg-blue-100 border border-blue-400 rounded p-3 text-center\">\n            <p className=\"font-bold text-blue-800\">\n              Your bet: {userBet.toUpperCase()}\n            </p>\n            <p className=\"text-sm text-blue-600\">Wheel spinning...</p>\n          </div>\n        )}\n\n        {/* Result */}\n        {result && (\n          <div className={`border-2 rounded p-4 text-center ${result.color === userBet ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>\n            <div className=\"text-4xl mb-2\">\n              {result.color === 'red' ? '🔴' : result.color === 'black' ? '⚫' : '🟢'}\n            </div>\n            <p className=\"font-bold text-lg\">\n              {result.color.toUpperCase()} {result.number}\n            </p>\n            <p className=\"text-sm\">\n              {result.color === userBet ? '🎉 You Win!' : '😢 House Wins'}\n            </p>\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n\nexport default function BetOnRouletteGameComponent(props: GameProps) {\n  return (\n    <BaseGame\n      title=\"Bet On Roulette\"\n      instructions=\"Place your bet before the wheel stops spinning!\"\n      duration={8}\n      {...props}\n    >\n      <BetOnRouletteGame />\n    </BaseGame>\n  );\n}"