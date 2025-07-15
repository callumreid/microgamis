export interface ExternalGameConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  showHubLoadingScreen: boolean;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  requiresVoice: boolean;
  requiresAudio: boolean;
  estimatedDuration: number;
}

export const externalGames: Record<string, ExternalGameConfig> = {
  "song-quiz": {
    id: "song-quiz",
    name: "Song Quiz",
    description: "Test your music knowledge in this fast-paced song guessing game!",
    url: process.env.NEXT_PUBLIC_SONG_QUIZ_URL || "https://songquiz.volleygames.com",
    showHubLoadingScreen: false, // Disable hub loading screen for SQ as it loads quickly
    category: "music",
    difficulty: 3,
    requiresVoice: false,
    requiresAudio: true,
    estimatedDuration: 180,
  },
  "jeopardy": {
    id: "jeopardy",
    name: "Jeopardy!",
    description: "The classic quiz show game - test your knowledge across categories!",
    url: process.env.NEXT_PUBLIC_JEOPARDY_URL || "https://jeopardy.volleygames.com",
    showHubLoadingScreen: true, // Keep loading screen for Jeopardy as it takes time to load
    category: "trivia",
    difficulty: 4,
    requiresVoice: false,
    requiresAudio: true,
    estimatedDuration: 300,
  },
};

export function getExternalGame(id: string): ExternalGameConfig | undefined {
  return externalGames[id];
}

export function isExternalGame(id: string): boolean {
  return id in externalGames;
}