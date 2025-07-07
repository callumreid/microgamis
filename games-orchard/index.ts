import { GameMetadata } from "./types";

// Import implemented games
// import PointEngineeringTaskGame, { metadata as pointTaskMetadata } from './point-the-engineering-task';
// import AnimalSoundGame, { metadata as animalSoundMetadata } from './what-sound-does-this-animal-make';
// import BuffaloGame, { metadata as buffaloMetadata } from './buffalo';
// import MakeExcuseGame, { metadata as makeExcuseMetadata } from './make-up-an-excuse';
// import ConvinceAliensGame, { metadata as convinceAliensMetadata } from './convince-aliens-not-to-invade';
// import PwnBullyGame, { metadata as pwnBullyMetadata } from './pwn-the-bully';
// import EvaluateYourselfGame, { metadata as evaluateYourselfMetadata } from './evaluate-yourself';
// import SteerShipGame, { metadata as steerShipMetadata } from './steer-the-ship';
// import IdentifyCriminalGame, { metadata as identifyCriminalMetadata } from './identify-the-criminal';
// import ExplainDeathGame, { metadata as explainDeathMetadata } from './explain-death-to-daughter';
// import StallPoliceGame, { metadata as stallPoliceMetadata } from './stall-the-police';
// import PitchStartupGame, { metadata as pitchStartupMetadata } from './pitch-your-startup';
// import SellCarGame, { metadata as sellCarMetadata } from './sell-the-car';
// import GoneFishingGame, { metadata as goneFishingMetadata } from './gone-fishing';
// import VolcanoCasinoGame, { metadata as volcanoCasinoMetadata } from './volcano-casino';
// import NameThatCapitolGame, { metadata as nameCapitolMetadata } from './name-that-capitol';
// import NameThePlanetGame, { metadata as namePlanetMetadata } from './name-the-planet';
// import WhosThatPokemonGame, { metadata as pokemonMetadata } from './whos-that-pokemon';
import AdviseChildGame, {
  metadata as adviseChildMetadata,
} from "./advise-the-child";
// import JumpOffBridgeGame, { metadata as jumpBridgeMetadata } from './jump-off-bridge';
// import FinishLimerickGame, { metadata as limerickMetadata } from './finish-the-limerick';
// import HowManyCowsGame, { metadata as cowsMetadata } from './how-many-cows';
// import AimPenaltyKickGame, { metadata as penaltyKickMetadata } from './aim-the-penalty-kick';
// import AssembleBurgerGame, { metadata as burgerMetadata } from './assemble-the-burger';
// import AttractTurkeyGame, { metadata as turkeyMetadata } from './attract-the-turkey';
// import BetRouletteGame, { metadata as rouletteMetadata } from './bet-on-roulette';
// import FireEmployeeGame, { metadata as fireEmployeeMetadata } from './fire-the-employee';
// import HowManyGumballsGame, { metadata as gumballsMetadata } from './how-many-gumballs';
// import PickNotPoisonGame, { metadata as notPoisonMetadata } from './pick-the-not-poison';
// import ShatterGlassGame, { metadata as shatterGlassMetadata } from './shatter-the-glass';
// import TellCaptainGame, { metadata as tellCaptainMetadata } from './tell-the-captain-where-the-land-is';

// Game registry mapping
export const implementedGames = {
  // 'point-the-engineering-task': PointEngineeringTaskGame,
  // 'what-sound-does-this-animal-make': AnimalSoundGame,
  // 'buffalo': BuffaloGame,
  // 'make-up-an-excuse': MakeExcuseGame,
  // 'convince-aliens-not-to-invade': ConvinceAliensGame,
  // 'pwn-the-bully': PwnBullyGame,
  // 'evaluate-yourself': EvaluateYourselfGame,
  // 'steer-the-ship': SteerShipGame,
  // 'identify-the-criminal': IdentifyCriminalGame,
  // 'explain-death-to-daughter': ExplainDeathGame,
  // 'stall-the-police': StallPoliceGame,
  // 'pitch-your-startup': PitchStartupGame,
  // 'sell-the-car': SellCarGame,
  // 'gone-fishing': GoneFishingGame,
  // 'volcano-casino': VolcanoCasinoGame,
  // 'name-that-capitol': NameThatCapitolGame,
  // 'name-the-planet': NameThePlanetGame,
  // 'whos-that-pokemon': WhosThatPokemonGame,
  "advise-the-child": AdviseChildGame,
  // 'jump-off-bridge': JumpOffBridgeGame,
  // 'finish-the-limerick': FinishLimerickGame,
  // 'how-many-cows': HowManyCowsGame,
  // 'aim-the-penalty-kick': AimPenaltyKickGame,
  // 'assemble-the-burger': AssembleBurgerGame,
  // 'attract-the-turkey': AttractTurkeyGame,
  // 'bet-on-roulette': BetRouletteGame,
  // 'fire-the-employee': FireEmployeeGame,
  // 'how-many-gumballs': HowManyGumballsGame,
  // 'pick-the-not-poison': PickNotPoisonGame,
  // 'shatter-the-glass': ShatterGlassGame,
  // 'tell-the-captain-where-the-land-is': TellCaptainGame,
};

// Implemented game metadata
export const implementedGameMetadata: GameMetadata[] = [
  // pointTaskMetadata,
  // animalSoundMetadata,
  // buffaloMetadata,
  // makeExcuseMetadata,
  // convinceAliensMetadata,
  // pwnBullyMetadata,
  // evaluateYourselfMetadata,
  // steerShipMetadata,
  // identifyCriminalMetadata,
  // explainDeathMetadata,
  // stallPoliceMetadata,
  // pitchStartupMetadata,
  // sellCarMetadata,
  // goneFishingMetadata,
  // volcanoCasinoMetadata,
  // nameCapitolMetadata,
  // namePlanetMetadata,
  // pokemonMetadata,
  adviseChildMetadata,
  // jumpBridgeMetadata,
  // limerickMetadata,
  // cowsMetadata,
  // penaltyKickMetadata,
  // burgerMetadata,
  // turkeyMetadata,
  // rouletteMetadata,
  // fireEmployeeMetadata,
  // gumballsMetadata,
  // notPoisonMetadata,
  // shatterGlassMetadata,
  // tellCaptainMetadata,
];

// Complete list of all planned games (implemented + planned)
export const allPlannedGames: GameMetadata[] = [
  {
    id: "sample-game",
    name: "Sample Game",
    description: "A sample game for testing",
    category: "action",
    difficulty: 1,
    requiresVoice: false,
    requiresAudio: false,
    estimatedDuration: 10,
  },
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
