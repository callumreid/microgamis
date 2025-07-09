import { GameMetadata } from "../types";
import SteerShipGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "steer-the-ship",
  name: "Steer the Ship",
  description: "Navigate your doomed vessel through existential waters using only voice commands",
  category: "action",
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default SteerShipGameComponent;