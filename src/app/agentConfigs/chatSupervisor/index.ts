import { RealtimeAgent } from "@openai/agents/realtime";
import { gameHostAgentInstructions, gameHostTools } from "./gameHostAgent";

export const chatAgent = new RealtimeAgent({
  name: "gameHostAgent",
  voice: "ash",
  instructions: gameHostAgentInstructions,
  tools: gameHostTools,
});

export const chatSupervisorScenario = [chatAgent];

// Name of the company represented by this agent set. Used by guardrails
export const chatSupervisorCompanyName = "Microgamis";

export default chatSupervisorScenario;
