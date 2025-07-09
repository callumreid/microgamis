import { GameMetadata } from "../types";
import GoneFishingGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "gone-fishing",
  name: "Gone Fishing",
  description: "Tell the perfect fishing story to impress your cynical buddies",
  category: "creative",
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default GoneFishingGameComponent;