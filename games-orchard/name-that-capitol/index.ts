import { GameMetadata } from '../types';
import NameThatCapitolGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'name-that-capitol',
  name: 'Name That Capital',
  description: 'Identify the capital city of the country shown',
  category: 'recognition',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default NameThatCapitolGameComponent;