import { GameMetadata } from "../types";
import WhosThatPokemonGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "whos-that-pokemon",
  name: "Who's That Pokemon?",
  description: "Identify Pokemon to prove you wasted your youth properly",
  category: "recognition",
  difficulty: 3,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default WhosThatPokemonGameComponent;