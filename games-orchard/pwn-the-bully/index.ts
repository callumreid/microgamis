import { GameMetadata } from '../types';
import PwnBullyGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'pwn-the-bully',
  name: 'Pwn the Bully',
  description: 'Deliver the perfect comeback',
  category: 'social',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 8,
};

export default PwnBullyGameComponent;