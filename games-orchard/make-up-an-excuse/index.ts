import { GameMetadata } from '../types';
import MakeExcuseGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'make-up-an-excuse',
  name: 'Make Up an Excuse',
  description: 'Convince your boss why you\'re late',
  category: 'social',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default MakeExcuseGameComponent;