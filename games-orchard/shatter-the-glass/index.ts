import { GameMetadata } from '../types';
import ShatterTheGlassGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'shatter-the-glass',
  name: 'Shatter The Glass',
  description: 'Sing at high pitch to vibrate and shatter the glass panel',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 15,
};

export default ShatterTheGlassGameComponent;