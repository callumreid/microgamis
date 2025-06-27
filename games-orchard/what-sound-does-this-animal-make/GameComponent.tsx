"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface Animal {
  name: string;
  emoji: string;
  sounds: string[];
  correctSound: string;
}

const animals: Animal[] = [
  { name: 'Cow', emoji: '🐄', sounds: ['moo', 'mooo', 'mow'], correctSound: 'moo' },
  { name: 'Dog', emoji: '🐕', sounds: ['woof', 'bark', 'ruff', 'arf'], correctSound: 'woof' },
  { name: 'Cat', emoji: '🐱', sounds: ['meow', 'mew', 'purr'], correctSound: 'meow' },
  { name: 'Pig', emoji: '🐷', sounds: ['oink', 'snort'], correctSound: 'oink' },
  { name: 'Duck', emoji: '🦆', sounds: ['quack', 'quak'], correctSound: 'quack' },
  { name: 'Rooster', emoji: '🐓', sounds: ['cock-a-doodle-doo', 'cockadoodledoo', 'crow'], correctSound: 'cock-a-doodle-doo' },
  { name: 'Sheep', emoji: '🐑', sounds: ['baa', 'baaa', 'bleat'], correctSound: 'baa' },
  { name: 'Horse', emoji: '🐴', sounds: ['neigh', 'whinny'], correctSound: 'neigh' },
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function AnimalSoundGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: GameControlProps) {
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setCurrentAnimal(randomAnimal);
    updateMessage(`What sound does this ${randomAnimal.name.toLowerCase()} make?`);
    
    if (sendVoiceMessage) {
      sendVoiceMessage(`What sound does this ${randomAnimal.name} make? Make the sound with your voice!`);
    }
  }, [updateMessage, sendVoiceMessage]);

  useEffect(() => {
    if (onVoiceInput && !hasAnswered && currentAnimal) {
      const handleVoiceInput = (transcript: string) => {
        const input = transcript.toLowerCase().trim();
        
        // Check if the input contains any of the correct sounds for this animal
        const isCorrect = currentAnimal.sounds.some(sound => 
          input.includes(sound.toLowerCase()) || 
          sound.toLowerCase().includes(input)
        );
        
        if (isCorrect) {
          setHasAnswered(true);
          setShowSuccess(true);
          updateMessage(`Correct! The ${currentAnimal.name.toLowerCase()} says "${currentAnimal.correctSound}"!`);
          
          if (playSound) {
            playSound('animal-success');
          }
          
          if (sendVoiceMessage) {
            sendVoiceMessage(`${currentAnimal.correctSound}! Great job!`);
          }
          
          setTimeout(() => {
            endGame(true, `Perfect! You made the right ${currentAnimal.name.toLowerCase()} sound!`, 100);
          }, 2000);
        } else if (input.length > 2) { // Only respond to substantial input
          setHasAnswered(true);
          endGame(false, `That doesn't sound like a ${currentAnimal.name.toLowerCase()}! The correct sound is "${currentAnimal.correctSound}".`, 0);
        }
      };
      
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, hasAnswered, currentAnimal, endGame, updateMessage, sendVoiceMessage, playSound]);

  if (!currentAnimal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center max-w-2xl">
      <div className="bg-white bg-opacity-20 rounded-lg p-8 mb-6">
        <div className="text-8xl mb-4">{currentAnimal.emoji}</div>
        <h3 className="text-3xl font-bold mb-4">{currentAnimal.name}</h3>
      </div>
      
      <p className="text-xl mb-4">
        🎤 Make the sound this animal makes!
      </p>
      
      {showSuccess && (
        <div className="text-6xl animate-bounce">
          🎉
        </div>
      )}
      
      {hasAnswered && !showSuccess && (
        <div className="mt-4 text-yellow-300">
          <p>Hmm, that doesn't sound right...</p>
        </div>
      )}
    </div>
  );
}

export default function AnimalSoundGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="What Sound Does This Animal Make?"
      instructions="Look at the animal and make its sound with your voice!"
      duration={10}
      {...props}
    >
      <AnimalSoundGame />
    </BaseGame>
  );
}