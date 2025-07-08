import { RealtimeAgent } from "@openai/agents/realtime";
import {
  gameHostAgentInstructions,
  gameHostTools,
} from "../chatSupervisor/gameHostAgent";

// Create a standalone game host agent (not part of chat supervisor handoff chain)
const gameHostAgent = new RealtimeAgent({
  name: "gameHost",
  instructions: gameHostAgentInstructions,
  tools: gameHostTools,
});

// Export the game host scenario with only the game host agent
export const gameHostScenario: RealtimeAgent[] = [gameHostAgent];

// Default export for convenience
export const defaultGameAgentSet = gameHostScenario;
