import { GameMetadata } from "../types";
import IdentifyCriminalGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "identify-the-criminal",
  name: "Identify the Criminal",
  description: "Use your detective skills to identify the suspect from witness descriptions",
  category: "recognition",
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default IdentifyCriminalGameComponent;