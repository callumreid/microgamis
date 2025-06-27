import { GameMetadata } from '../types';
import JumpOffBridgeGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'jump-off-bridge',
  name: 'Jump Off Bridge',
  description: 'Everyone is jumping - will you follow or be different?',
  category: 'social',
  difficulty: 1,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default JumpOffBridgeGameComponent;