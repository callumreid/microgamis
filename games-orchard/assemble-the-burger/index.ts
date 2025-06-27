import { GameMetadata } from '../types';
import AssembleTheBurgerGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'assemble-the-burger',
  name: 'Assemble The Burger',
  description: 'Memorize ingredients and say them in the correct stacking order',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 12,
};

export default AssembleTheBurgerGameComponent;