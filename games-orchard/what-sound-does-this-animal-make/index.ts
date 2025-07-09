import { GameMetadata } from "../types";
import AnimalSoundGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "what-sound-does-this-animal-make",
  name: "What Sound Does This Animal Make?",
  description: "Make the correct animal sound to prove you're not a robot pretending to be human",
  category: "recognition",
  difficulty: 2,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default AnimalSoundGameComponent;