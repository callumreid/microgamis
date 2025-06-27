import { GameMetadata } from '../types';
import VolcanoCasinoGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'volcano-casino',
  name: 'Volcano Casino',
  description: 'Get as close to the volcano as you can without getting melted',
  category: 'action',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default VolcanoCasinoGameComponent;