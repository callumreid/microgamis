import { GameMetadata } from '../types';
import GoneFishingGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'gone-fishing',
  name: 'Gone Fishing',
  description: 'Try to catch the biggest fish based on bobber movement',
  category: 'action',
  difficulty: 2,
  requiresVoice: false,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default GoneFishingGameComponent;