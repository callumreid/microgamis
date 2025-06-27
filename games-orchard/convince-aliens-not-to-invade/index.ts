import { GameMetadata } from '../types';
import ConvinceAliensGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'convince-aliens-not-to-invade',
  name: 'Convince Aliens Not to Invade',
  description: 'Be humanity\'s first diplomat',
  category: 'social',
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default ConvinceAliensGameComponent;