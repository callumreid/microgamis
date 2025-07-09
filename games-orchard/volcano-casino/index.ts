import { GameMetadata } from "../types";
import VolcanoCasinoGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "volcano-casino",
  name: "Volcano Casino",
  description: "Place your bets before the volcano erupts and destroys everything",
  category: "decision",
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default VolcanoCasinoGameComponent;