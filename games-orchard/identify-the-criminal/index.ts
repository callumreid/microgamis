import { GameMetadata } from '../types';
import IdentifyCriminalGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'identify-the-criminal',
  name: 'Identify the Criminal',
  description: 'Pick the perpetrator from the lineup',
  category: 'recognition',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: false,
  estimatedDuration: 12,
};

export default IdentifyCriminalGameComponent;