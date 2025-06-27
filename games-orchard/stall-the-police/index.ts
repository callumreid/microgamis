import { GameMetadata } from '../types';
import StallPoliceGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'stall-the-police',
  name: 'Stall the Police',
  description: 'Buy time until the timer runs out',
  category: 'social',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default StallPoliceGameComponent;