import { GameMetadata } from '../types';
import WhosThatPokemonGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'whos-that-pokemon',
  name: "Who's That Pokemon?",
  description: 'Identify the Pokemon from its silhouette',
  category: 'recognition',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default WhosThatPokemonGameComponent;