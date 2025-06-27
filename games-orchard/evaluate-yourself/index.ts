import { GameMetadata } from '../types';
import EvaluateYourselfGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'evaluate-yourself',
  name: 'Evaluate Yourself',
  description: 'Fill out your self-evaluation correctly',
  category: 'decision',
  difficulty: 1,
  requiresVoice: true,
  requiresAudio: false,
  estimatedDuration: 10,
};

export default EvaluateYourselfGameComponent;