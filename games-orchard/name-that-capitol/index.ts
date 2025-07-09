import { GameMetadata } from "../types";
import NameCapitolGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "name-that-capitol",
  name: "Name That Capitol",
  description: "Test your geography knowledge in a world where borders are meaningless",
  category: "education",
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default NameCapitolGameComponent;