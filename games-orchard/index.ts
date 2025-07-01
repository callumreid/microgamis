import { GameMetadata } from "./types";

// Minimal export for build - no actual games imported

// Game registry mapping
export const implementedGames = {};

// Implemented game metadata
export const implementedGameMetadata: GameMetadata[] = [];

// Complete list of all planned games (implemented + planned)
export const allPlannedGames: GameMetadata[] = [
  {
    id: "sample-game",
    name: "Sample Game",
    description: "A sample game for testing",
    category: "action",
    difficulty: 1,
    requiresVoice: false,
    requiresAudio: false,
    estimatedDuration: 10,
  },
];

// Helper functions
export function getGameById(id: string) {
  return implementedGames[id as keyof typeof implementedGames];
}

export function getGameMetadata(id: string) {
  return allPlannedGames.find((game) => game.id === id);
}

export function getGamesByCategory(category: string) {
  return allPlannedGames.filter((game) => game.category === category);
}

export function getImplementedGames() {
  return implementedGameMetadata;
}

export function isGameImplemented(id: string) {
  return id in implementedGames;
}
