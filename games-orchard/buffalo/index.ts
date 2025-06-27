import { GameMetadata } from '../types';
import BuffaloGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'buffalo',
  name: 'BUFFALOOOO',
  description: 'Count buffalo in competing fields',
  category: 'counting',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default BuffaloGameComponent;