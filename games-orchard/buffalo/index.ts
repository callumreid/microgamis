import { GameMetadata } from "../types";
import BuffaloGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "buffalo",
  name: "Buffalo",
  description: "Follow the buffalo pattern or the herd will stampede your consciousness",
  category: "recognition",
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default BuffaloGameComponent;