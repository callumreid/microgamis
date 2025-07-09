import { GameMetadata } from "./types";
import AnimalSoundGame, {
  metadata as animalSoundMetadata,
} from "./what-sound-does-this-animal-make";
import BuffaloGame, {
  metadata as buffaloMetadata,
} from "./buffalo";
import SteerShipGame, {
  metadata as steerShipMetadata,
} from "./steer-the-ship";
import IdentifyCriminalGame, {
  metadata as identifyCriminalMetadata,
} from "./identify-the-criminal";
import GoneFishingGame, {
  metadata as goneFishingMetadata,
} from "./gone-fishing";
import VolcanoCasinoGame, {
  metadata as volcanoCasinoMetadata,
} from "./volcano-casino";
import NameCapitolGame, {
  metadata as nameCapitolMetadata,
} from "./name-that-capitol";
import WhosThatPokemonGame, {
  metadata as whosThatPokemonMetadata,
} from "./whos-that-pokemon";
import JumpOffBridgeGame, {
  metadata as jumpOffBridgeMetadata,
} from "./jump-off-bridge";
import FinishLimerickGame, {
  metadata as finishLimerickMetadata,
} from "./finish-the-limerick";
import SaveTheirSoulGame, {
  metadata as saveTheirSoulMetadata,
} from "./save-their-soul";
import AdviseTheChildGame, {
  metadata as adviseTheChildMetadata,
} from "./advise-the-child";
import StallThePoliceGame, {
  metadata as stallThePoliceMetadata,
} from "./stall-the-police";
import ConvinceTheAliensGame, {
  metadata as convinceTheAliensMetadata,
} from "./convince-the-aliens";
import EvaluateYourselfGame, {
  metadata as evaluateYourselfMetadata,
} from "./evaluate-yourself";
import PointTheTaskGame, {
  metadata as pointTheTaskMetadata,
} from "./point-the-task";
import SellTheLemonGame, {
  metadata as sellTheLemonMetadata,
} from "./sell-the-lemon";
import PwnTheBullyGame, {
  metadata as pwnTheBullyMetadata,
} from "./pwn-the-bully";
import ExplainDeathGame, {
  metadata as explainDeathMetadata,
} from "./explain-death";
import AttractTheTurkeyGame, {
  metadata as attractTheTurkeyMetadata,
} from "./attract-the-turkey";
import ExcuseTheBossGame, {
  metadata as excuseTheBossMetadata,
} from "./excuse-the-boss";
import PitchStartupGame, {
  metadata as pitchStartupMetadata,
} from "./pitch-startup";

// Minimal export for build - no actual games imported

// Game registry mapping
export const implementedGames = {
  "what-sound-does-this-animal-make": AnimalSoundGame,
  "buffalo": BuffaloGame,
  "steer-the-ship": SteerShipGame,
  "identify-the-criminal": IdentifyCriminalGame,
  "gone-fishing": GoneFishingGame,
  "volcano-casino": VolcanoCasinoGame,
  "name-that-capitol": NameCapitolGame,
  "whos-that-pokemon": WhosThatPokemonGame,
  "jump-off-bridge": JumpOffBridgeGame,
  "finish-the-limerick": FinishLimerickGame,
  "save-their-soul": SaveTheirSoulGame,
  "pitch-startup": PitchStartupGame,
  "excuse-the-boss": ExcuseTheBossGame,
  "attract-the-turkey": AttractTheTurkeyGame,
  "pwn-the-bully": PwnTheBullyGame,
  "explain-death": ExplainDeathGame,
  "advise-the-child": AdviseTheChildGame,
  "stall-the-police": StallThePoliceGame,
  "convince-the-aliens": ConvinceTheAliensGame,
  "evaluate-yourself": EvaluateYourselfGame,
  "point-the-task": PointTheTaskGame,
  "sell-the-lemon": SellTheLemonGame,
};

// Implemented game metadata
export const implementedGameMetadata: GameMetadata[] = [
  animalSoundMetadata,
  buffaloMetadata,
  steerShipMetadata,
  identifyCriminalMetadata,
  goneFishingMetadata,
  volcanoCasinoMetadata,
  nameCapitolMetadata,
  whosThatPokemonMetadata,
  jumpOffBridgeMetadata,
  finishLimerickMetadata,
  adviseTheChildMetadata,
  pitchStartupMetadata,
  attractTheTurkeyMetadata,
  excuseTheBossMetadata,
  pwnTheBullyMetadata,
  explainDeathMetadata,
  sellTheLemonMetadata,
  pointTheTaskMetadata,
  convinceTheAliensMetadata,
  evaluateYourselfMetadata,
  stallThePoliceMetadata,
  saveTheirSoulMetadata,
];

// Complete list of all planned games (implemented + planned)
export const allPlannedGames: GameMetadata[] = [
  // Include all implemented games
  ...implementedGameMetadata,
  // Add any additional planned games here
];

// Helper functions
export function getGameById(id: string) {
  return implementedGames[id as keyof typeof implementedGames];
}

export function getGameMetadata(id: string) {
  return allPlannedGames.find((game) => game.id === id);
}

export function getGamesByCategory(category: string) {
  return allPlannedGames.filter((game) => game.category === category);
}

export function getImplementedGames() {
  return implementedGameMetadata;
}

export function isGameImplemented(id: string) {
  return id in implementedGames;
}
