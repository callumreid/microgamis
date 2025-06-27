import { GameMetadata } from '../types';
import NameThePlanetGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'name-the-planet',
  name: 'Name The Planet',
  description: 'Identify the planet shown from our solar system',
  category: 'recognition',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default NameThePlanetGameComponent;