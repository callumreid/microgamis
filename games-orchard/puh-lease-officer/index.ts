import { GameMetadata } from "../types";
import PuhLeaseOfficerGameComponent from "./GameComponent";

export const metadata: GameMetadata = {
  id: "puh-lease-officer",
  name: "Puh Lease Officer",
  description: "Convince the police officer to leave after they respond to a noise complaint - or face the handcuffs!",
  category: "social",
  difficulty: 4,
  requiresVoice: true,
  requiresAudio: true,
  estimatedDuration: 30,
};

export default PuhLeaseOfficerGameComponent;