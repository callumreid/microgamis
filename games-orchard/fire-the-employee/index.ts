import { GameMetadata } from '../types';
import FireTheEmployeeGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'fire-the-employee',
  name: 'Fire The Employee',
  description: 'Be the boss and terminate a problematic employee professionally',
  category: 'social',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default FireTheEmployeeGameComponent;