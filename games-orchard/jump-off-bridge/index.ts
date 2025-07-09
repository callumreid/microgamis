import { GameMetadata } from "../types";
import JumpOffBridgeGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "jump-off-bridge",
  name: "Jump Off Bridge",
  description: "Convince someone NOT to jump using reverse psychology and existential dread",
  category: "social",
  difficulty: 5,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default JumpOffBridgeGameComponent;