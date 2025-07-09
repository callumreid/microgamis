import { GameMetadata } from "../types";
import FinishLimerickGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "finish-the-limerick",
  name: "Finish the Limerick",
  description: "Complete crude limericks to prove poetry died for a reason",
  category: "creative",
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default FinishLimerickGameComponent;