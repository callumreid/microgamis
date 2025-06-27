import { GameMetadata } from '../types';
import AnimalSoundGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'what-sound-does-this-animal-make',
  name: 'What Sound Does This Animal Make?',
  description: 'Make the right animal sound to win',
  category: 'recognition',
  difficulty: 1,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default AnimalSoundGameComponent;