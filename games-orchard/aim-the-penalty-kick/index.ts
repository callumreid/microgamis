import { GameMetadata } from '../types';
import AimThePenaltyKickGameComponent from './GameComponent';

export const metadata: GameMetadata = {
  id: 'aim-the-penalty-kick',
  name: 'Aim The Penalty Kick',
  description: 'Choose where to shoot and score past the goalkeeper',
  category: 'action',
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 10,
};

export default AimThePenaltyKickGameComponent;