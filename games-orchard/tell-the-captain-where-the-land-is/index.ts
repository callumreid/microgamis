import { GameMetadata } from '../types';
import TellTheCaptainGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'tell-the-captain-where-the-land-is',
  name: 'Tell The Captain Where The Land Is',
  description: 'Alert the captain to land in the correct naval direction',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default TellTheCaptainGameComponent;