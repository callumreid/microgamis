import { GameMetadata } from '../types';
import PitchStartupGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'pitch-your-startup',
  name: 'Pitch Your Startup',
  description: 'Convince investors to fund your idea',
  category: 'social',
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 15,
};

export default PitchStartupGameComponent;