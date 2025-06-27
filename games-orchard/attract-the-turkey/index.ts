import { GameMetadata } from '../types';
import AttractTheTurkeyGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'attract-the-turkey',
  name: 'Attract The Turkey',
  description: 'Make turkey sounds to call a shy turkey over to you',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default AttractTheTurkeyGameComponent;