import { GameMetadata } from '../types';
import SellCarGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'sell-the-car',
  name: 'Sell the Car',
  description: 'Close the deal like a pro',
  category: 'social',
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 15,
};

export default SellCarGameComponent;