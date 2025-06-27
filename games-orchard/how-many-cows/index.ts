import { GameMetadata } from '../types';
import HowManyCowsGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'how-many-cows',
  name: 'How Many Cows?',
  description: 'Count the cows in a stampede and remember the number',
  category: 'counting',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default HowManyCowsGameComponent;