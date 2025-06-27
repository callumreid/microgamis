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

function HowManyGumballsGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [actualCount, setActualCount] = useState(0);
  const [showingGumballs, setShowingGumballs] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [gumballs, setGumballs] = useState<{color: string, x: number, y: number}[]>([]);
  const [panPosition, setPanPosition] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game data once
  useEffect(() => {
    if (!isInitialized) {
      // Generate random number of gumballs (30-80)
      const count = 30 + Math.floor(Math.random() * 51);
      setActualCount(count);
      
      // Generate gumball positions
      const colors = ['🔴', '🟡', '🔵', '🟢', '🟠', '🟣'];
      const gumballArray = Array.from({ length: count }, (_, i) => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        x: (i % 8) * 12.5 + Math.random() * 5, // Arranged in tower formation
        y: Math.floor(i / 8) * 8 + Math.random() * 3,
      }));
      setGumballs(gumballArray);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle game setup and animation
  useEffect(() => {
    if (isInitialized) {
      updateMessage('Count the gumballs as the camera pans across!');
      if (sendVoiceMessage) {
        sendVoiceMessage('Welcome to the gumball counting challenge! I\'m going to slowly pan across a tower of colorful gumballs. Count them carefully as they pass by - you need to guess within 10% to win!');
      }

      // Slow pan animation
      const panTimer = setInterval(() => {
        setPanPosition(prev => {
          if (prev >= 100) {
            clearInterval(panTimer);
            return 100;
          }
          return prev + 1;
        });
      }, 80); // Slow pan over 8 seconds

      // Hide gumballs after pan completes
      const hideTimer = setTimeout(() => {
        setShowingGumballs(false);
        updateMessage('The camera has panned across the tower. How many gumballs did you count?');
        if (sendVoiceMessage) {
          sendVoiceMessage('The pan is complete! Now tell me how many gumballs you counted in that colorful tower. Remember, you need to be within 10% of the actual count to win!');
        }
      }, 8500);

      return () => {
        clearInterval(panTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && !showingGumballs) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        // Extract number from speech
        const numbers = input.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const guessedCount = parseInt(numbers[0]);
          setHasAnswered(true);
          
          const difference = Math.abs(guessedCount - actualCount);
          const percentageOff = (difference / actualCount) * 100;
          const isWithin10Percent = percentageOff <= 10;
          
          if (percentageOff === 0) {
            updateMessage(`Perfect! Exactly ${actualCount} gumballs!`);
            if (sendVoiceMessage) {
              sendVoiceMessage(`Incredible! You counted exactly right - there were ${actualCount} gumballs! You have the eyes of a master counter!`);
            }
            endGame(true, `Perfect count! Exactly ${actualCount} gumballs!`, 100);
          } else if (isWithin10Percent) {
            updateMessage(`Excellent! Very close! There were ${actualCount} gumballs, you guessed ${guessedCount}.`);
            if (sendVoiceMessage) {\n              sendVoiceMessage(`Outstanding! You were within 10% of the correct count! There were ${actualCount} gumballs and you guessed ${guessedCount}. That's fantastic counting!`);\n            }\n            const score = Math.max(70, 100 - Math.floor(percentageOff * 3));\n            endGame(true, `Great counting! Within 10% accuracy!`, score);\n          } else if (percentageOff <= 25) {\n            updateMessage(`Not bad! There were ${actualCount} gumballs, you guessed ${guessedCount}.`);\n            if (sendVoiceMessage) {\n              sendVoiceMessage(`Decent attempt! You were a bit off - there were ${actualCount} gumballs and you guessed ${guessedCount}. Keep practicing your counting skills!`);\n            }\n            const score = Math.max(30, 70 - Math.floor(percentageOff * 2));\n            endGame(false, `Outside the 10% range, but not too bad!`, score);\n          } else {\n            updateMessage(`Way off! There were ${actualCount} gumballs, you guessed ${guessedCount}.`);\n            if (sendVoiceMessage) {\n              sendVoiceMessage(`Quite far off! There were ${actualCount} gumballs but you guessed ${guessedCount}. That colorful tower was tricky to count!`);\n            }\n            endGame(false, `Too far off! Difference of ${difference}`, Math.max(10, 50 - Math.floor(percentageOff)));\n          }\n        }\n      };\n      \n      onVoiceInput(handleVoiceInput);\n    }\n  }, [onVoiceInput, hasAnswered, showingGumballs, actualCount, endGame, updateMessage, sendVoiceMessage]);\n\n  return (\n    <div className=\"w-full h-full relative bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 overflow-hidden\">\n      {/* Candy shop background */}\n      <div className=\"absolute inset-0\">\n        <div className=\"absolute top-4 left-4 text-3xl animate-bounce\">🍭</div>\n        <div className=\"absolute top-8 right-8 text-2xl animate-bounce\" style={{ animationDelay: '0.5s' }}>🍬</div>\n        <div className=\"absolute bottom-8 left-8 text-3xl animate-bounce\" style={{ animationDelay: '1s' }}>🧁</div>\n        <div className=\"absolute bottom-4 right-4 text-2xl animate-bounce\" style={{ animationDelay: '1.5s' }}>🍩</div>\n      </div>\n\n      {/* Gumball machine/tower */}\n      <div className=\"absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80\">\n        {/* Machine frame */}\n        <div className=\"absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 rounded-lg border-4 border-red-800\">\n          {/* Glass dome */}\n          <div className=\"absolute top-4 left-4 right-4 bottom-20 bg-blue-100 bg-opacity-30 rounded border-2 border-gray-300 overflow-hidden\">\n            {/* Viewport that pans across gumballs */}\n            {showingGumballs && (\n              <div \n                className=\"absolute inset-0 transition-transform duration-100 ease-linear\"\n                style={{ transform: `translateX(-${panPosition}%)` }}\n              >\n                {/* Gumballs */}\n                {gumballs.map((gumball, i) => (\n                  <div\n                    key={i}\n                    className=\"absolute text-lg\"\n                    style={{\n                      left: `${gumball.x}%`,\n                      bottom: `${gumball.y}%`,\n                    }}\n                  >\n                    {gumball.color}\n                  </div>\n                ))}\n              </div>\n            )}\n            \n            {/* Pan indicator */}\n            {showingGumballs && (\n              <div className=\"absolute bottom-2 left-2 right-2 h-1 bg-gray-400 rounded\">\n                <div \n                  className=\"h-full bg-green-500 rounded transition-all duration-100\"\n                  style={{ width: `${panPosition}%` }}\n                ></div>\n              </div>\n            )}\n          </div>\n          \n          {/* Machine base */}\n          <div className=\"absolute bottom-4 left-4 right-4 h-12 bg-gray-600 rounded border-2 border-gray-800 flex items-center justify-center\">\n            <div className=\"text-white font-bold text-sm\">GUMBALL COUNTER</div>\n          </div>\n        </div>\n      </div>\n\n      {/* Instructions overlay */}\n      {showingGumballs && (\n        <div className=\"absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center\">\n          <h3 className=\"text-lg font-bold mb-2\">📹 Camera Panning</h3>\n          <p className=\"text-sm\">Count the gumballs as they pass by!</p>\n          <div className=\"mt-2 text-xs opacity-75\">\n            Pan Progress: {panPosition}%\n          </div>\n        </div>\n      )}\n\n      {/* Answer prompt */}\n      {!showingGumballs && !hasAnswered && (\n        <div className=\"absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center\">\n          <div className=\"bg-white rounded-lg shadow-lg p-8 text-center max-w-md\">\n            <div className=\"text-6xl mb-4\">🤔</div>\n            <h3 className=\"text-2xl font-bold mb-4 text-gray-800\">\n              Time to guess!\n            </h3>\n            <p className=\"text-lg text-gray-600 mb-4\">\n              How many gumballs did you count?\n            </p>\n            <div className=\"bg-green-100 border border-green-300 rounded p-3\">\n              <p className=\"text-md font-semibold text-green-800\">\n                🎤 Say the number you counted!\n              </p>\n              <p className=\"text-xs text-green-600 mt-1\">\n                (Within 10% to win)\n              </p>\n            </div>\n          </div>\n        </div>\n      )}\n\n      {/* Counter display */}\n      <div className=\"absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded\">\n        <div className=\"text-sm font-bold mb-1\">🎯 Challenge</div>\n        <div className=\"text-xs\">\n          {showingGumballs ? 'Counting in progress...' : 'Make your guess!'}\n        </div>\n        <div className=\"text-xs opacity-75\">\n          Target: Within 10% accuracy\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default function HowManyGumballsGameComponent(props: GameProps) {\n  return (\n    <BaseGame\n      title=\"How Many Gumballs?\"\n      instructions=\"Count the gumballs as the camera pans across the tower!\"\n      duration={12}\n      {...props}\n    >\n      <HowManyGumballsGame />\n    </BaseGame>\n  );\n}"