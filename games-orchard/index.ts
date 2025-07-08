import { GameMetadata } from "./types";
import AdviseTheChildGame, { metadata as adviseTheChildMetadata } from "./advise-the-child";
import StallThePoliceGame, { metadata as stallThePoliceMetadata } from "./stall-the-police";

// Minimal export for build - no actual games imported

// Game registry mapping
export const implementedGames = {
  "advise-the-child": AdviseTheChildGame,
  "stall-the-police": StallThePoliceGame,
};

// Implemented game metadata
export const implementedGameMetadata: GameMetadata[] = [adviseTheChildMetadata, stallThePoliceMetadata];

// Complete list of all planned games (implemented + planned)
export const allPlannedGames: GameMetadata[] = [
  // Include all implemented games
  ...implementedGameMetadata,
  // Add any additional planned games here
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
