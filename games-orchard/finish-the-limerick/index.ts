import { GameMetadata } from '../types';
import FinishTheLimerickGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'finish-the-limerick',
  name: 'Finish The Limerick',
  description: 'Complete the Irish limerick started by a leprechaun',
  category: 'creative',
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default FinishTheLimerickGameComponent;