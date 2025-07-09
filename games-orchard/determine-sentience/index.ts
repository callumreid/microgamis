import DetermineSentienceGameComponent from "./GameComponent";
import { GameMetadata } from "../types";

export const metadata: GameMetadata = {
  id: "determine-sentience",
  name: "Determine Sentience",
  description: "A smart-speaker sits on a lab table. After hearing an interview transcript, you must determine: is this thing actually sentient or just a fancy waffle-iron? Choose wisely.",
  category: "technology",
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 20,
};

export default DetermineSentienceGameComponent;