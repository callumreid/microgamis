import { GameMetadata } from '../types';
import SteerShipGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'steer-the-ship',
  name: 'Steer the Ship',
  description: 'Navigate the Titanic away from danger',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 8,
};

export default SteerShipGameComponent;