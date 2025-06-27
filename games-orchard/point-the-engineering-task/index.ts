import { GameMetadata } from '../types';
import PointEngineeringTaskGame from './GameComponent';

export const metadata: GameMetadata = {
  id: 'point-the-engineering-task',
  name: 'Point the Engineering Task',
  description: 'Estimate task complexity using Fibonacci scale',
  category: 'decision',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default PointEngineeringTaskGame;