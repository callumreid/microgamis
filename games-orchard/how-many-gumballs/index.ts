import { GameMetadata } from '../types';
import HowManyGumballsGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'how-many-gumballs',
  name: 'How Many Gumballs?',
  description: 'Count gumballs during a slow camera pan across the tower',
  category: 'counting',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default HowManyGumballsGameComponent;