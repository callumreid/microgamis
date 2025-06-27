import { GameMetadata } from '../types';
import PickTheNotPoisonGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'pick-the-not-poison',
  name: 'Pick The Not Poison',
  description: 'Choose between two cups - one safe, one deadly',
  category: 'decision',
  difficulty: 1,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default PickTheNotPoisonGameComponent;