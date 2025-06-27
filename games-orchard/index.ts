import { GameMetadata } from './types';

// Import implemented games
import PointEngineeringTaskGame, { metadata as pointTaskMetadata } from './point-the-engineering-task';
import AnimalSoundGame, { metadata as animalSoundMetadata } from './what-sound-does-this-animal-make';
import BuffaloGame, { metadata as buffaloMetadata } from './buffalo';
import MakeExcuseGame, { metadata as makeExcuseMetadata } from './make-up-an-excuse';
import ConvinceAliensGame, { metadata as convinceAliensMetadata } from './convince-aliens-not-to-invade';
import PwnBullyGame, { metadata as pwnBullyMetadata } from './pwn-the-bully';
import EvaluateYourselfGame, { metadata as evaluateYourselfMetadata } from './evaluate-yourself';
import SteerShipGame, { metadata as steerShipMetadata } from './steer-the-ship';
import IdentifyCriminalGame, { metadata as identifyCriminalMetadata } from './identify-the-criminal';
import ExplainDeathGame, { metadata as explainDeathMetadata } from './explain-death-to-daughter';
import StallPoliceGame, { metadata as stallPoliceMetadata } from './stall-the-police';
import PitchStartupGame, { metadata as pitchStartupMetadata } from './pitch-your-startup';
import SellCarGame, { metadata as sellCarMetadata } from './sell-the-car';

// Game registry mapping
export const implementedGames = {
  'point-the-engineering-task': PointEngineeringTaskGame,
  'what-sound-does-this-animal-make': AnimalSoundGame,
  'buffalo': BuffaloGame,
  'make-up-an-excuse': MakeExcuseGame,
  'convince-aliens-not-to-invade': ConvinceAliensGame,
  'pwn-the-bully': PwnBullyGame,
  'evaluate-yourself': EvaluateYourselfGame,
  'steer-the-ship': SteerShipGame,
  'identify-the-criminal': IdentifyCriminalGame,
  'explain-death-to-daughter': ExplainDeathGame,
  'stall-the-police': StallPoliceGame,
  'pitch-your-startup': PitchStartupGame,
  'sell-the-car': SellCarGame,
};

// Implemented game metadata
export const implementedGameMetadata: GameMetadata[] = [
  pointTaskMetadata,
  animalSoundMetadata,
  buffaloMetadata,
  makeExcuseMetadata,
  convinceAliensMetadata,
  pwnBullyMetadata,
  evaluateYourselfMetadata,
  steerShipMetadata,
  identifyCriminalMetadata,
  explainDeathMetadata,
  stallPoliceMetadata,
  pitchStartupMetadata,
  sellCarMetadata,
];

// Complete list of all planned games (implemented + planned)
export const allPlannedGames: GameMetadata[] = [
  // Implemented games
  ...implementedGameMetadata,
  
  // Planned games (stubs)
  {
    id: 'make-up-an-excuse',
    name: 'Make Up an Excuse',
    description: 'Convince your boss why you\'re late',
    category: 'social',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'convince-aliens-not-to-invade',
    name: 'Convince Aliens Not to Invade',
    description: 'Be humanity\'s first diplomat',
    category: 'social',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'pwn-the-bully',
    name: 'Pwn the Bully',
    description: 'Deliver the perfect comeback',
    category: 'social',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'evaluate-yourself',
    name: 'Evaluate Yourself',
    description: 'Fill out your self-evaluation correctly',
    category: 'decision',
    difficulty: 1,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'steer-the-ship',
    name: 'Steer the Ship',
    description: 'Navigate the Titanic away from danger',
    category: 'action',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'gone-fishing',
    name: 'Gone Fishing',
    description: 'Catch the biggest fish',
    category: 'action',
    difficulty: 2,
    requiresVoice: false,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'volcano-casino',
    name: 'Volcano Casino',
    description: 'Get close to the volcano without getting burned',
    category: 'action',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'name-that-capitol',
    name: 'Name That Capitol',
    description: 'Identify world capitals',
    category: 'recognition',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'name-the-planet',
    name: 'Name the Planet',
    description: 'Identify planets in our solar system',
    category: 'recognition',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'whos-that-pokemon',
    name: 'Who\'s That Pokemon',
    description: 'Identify the mystery Pokemon',
    category: 'recognition',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'tell-the-captain-where-the-land-is',
    name: 'Tell the Captain Where the Land Is',
    description: 'Guide the ship to safety',
    category: 'action',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'advise-the-child',
    name: 'Advise the Child',
    description: 'Give helpful advice to a crying child',
    category: 'social',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'jump-off-bridge',
    name: 'Jump Off Bridge?',
    description: 'Decide whether to follow the crowd (you lose either way)',
    category: 'decision',
    difficulty: 1,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'aim-the-penalty-kick',
    name: 'Aim the Penalty Kick',
    description: 'Score by aiming where the goalie isn\'t',
    category: 'action',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'finish-the-limerick',
    name: 'Finish the Limerick',
    description: 'Complete the leprechaun\'s rhyme',
    category: 'creative',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'identify-the-criminal',
    name: 'Identify the Criminal',
    description: 'Pick the perpetrator from the lineup',
    category: 'recognition',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 10,
  },
  {
    id: 'how-many-cows',
    name: 'How Many Cows',
    description: 'Count the stampeding cattle',
    category: 'counting',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 10,
  },
  {
    id: 'attract-the-turkey',
    name: 'Attract the Turkey',
    description: 'Make turkey sounds to lure it over',
    category: 'recognition',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'explain-death-to-daughter',
    name: 'Explain Death to Daughter',
    description: 'Handle this delicate conversation',
    category: 'social',
    difficulty: 5,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'fire-the-employee',
    name: 'Fire the Employee',
    description: 'Stay firm and let them go',
    category: 'social',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'assemble-the-burger',
    name: 'Assemble the Burger',
    description: 'Stack ingredients in the right order',
    category: 'creative',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 10,
  },
  {
    id: 'stall-the-police',
    name: 'Stall the Police',
    description: 'Buy time until the timer runs out',
    category: 'social',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'pitch-your-startup',
    name: 'Pitch Your Startup',
    description: 'Convince investors to fund your idea',
    category: 'social',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'bet-on-roulette',
    name: 'Bet on Roulette',
    description: 'Choose red, black, or green',
    category: 'decision',
    difficulty: 1,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 8,
  },
  {
    id: 'how-many-gumballs',
    name: 'How Many Gumballs',
    description: 'Estimate within 10% to win',
    category: 'counting',
    difficulty: 3,
    requiresVoice: true,
    requiresAudio: false,
    estimatedDuration: 10,
  },
  {
    id: 'sell-the-car',
    name: 'Sell the Car',
    description: 'Close the deal like a pro',
    category: 'social',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
  {
    id: 'pick-the-not-poison',
    name: 'Pick the Not-Poison',
    description: 'Choose the safe cup from the magician',
    category: 'decision',
    difficulty: 2,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 8,
  },
  {
    id: 'shatter-the-glass',
    name: 'Shatter the Glass',
    description: 'Sing at the right pitch to break it',
    category: 'action',
    difficulty: 4,
    requiresVoice: true,
    requiresAudio: true,
    estimatedDuration: 10,
  },
];

// Helper functions
export function getGameById(id: string) {
  return implementedGames[id as keyof typeof implementedGames];
}

export function getGameMetadata(id: string) {
  return allPlannedGames.find(game => game.id === id);
}

export function getGamesByCategory(category: string) {
  return allPlannedGames.filter(game => game.category === category);
}

export function getImplementedGames() {
  return implementedGameMetadata;
}

export function isGameImplemented(id: string) {
  return id in implementedGames;
}