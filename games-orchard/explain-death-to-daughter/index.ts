import { GameMetadata } from '../types';
import ExplainDeathGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'explain-death-to-daughter',
  name: 'Explain Death to Daughter',
  description: 'Handle this delicate conversation',
  category: 'social',
  difficulty: 5,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 15,
};

export default ExplainDeathGameComponent;