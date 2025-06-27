import { GameMetadata } from '../types';
import BetOnRouletteGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'bet-on-roulette',
  name: 'Bet On Roulette',
  description: 'Place your bet on red, black, or green before the wheel stops',
  category: 'decision',
  difficulty: 1,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 8,
};

export default BetOnRouletteGameComponent;