import { tool } from "@openai/agents/realtime";
import {
  buildGameInstruction,
  getBasePrompt,
  GAME_KEYS,
  getGamePrompt,
} from "./prompts";

// Helper function to update session instructions
function updateSessionInstructions(gameKey: string, details: any) {
  const instructions = buildGameInstruction(gameKey);
  const updateInstructions = (details?.context as any)
    ?.updateSessionInstructions as ((instructions: string) => void) | undefined;

  if (updateInstructions) {
    updateInstructions(instructions);
  }
}

// Helper function to revert to base instructions
function revertToBaseInstructions(details: any) {
  const baseInstructions = getBasePrompt();
  const updateInstructions = (details?.context as any)
    ?.updateSessionInstructions as ((instructions: string) => void) | undefined;

  if (updateInstructions) {
    updateInstructions(baseInstructions);
  }
}

// Excuse the boss game scenarios
const bossExcuseScenarios = [
  {
    id: "morning_call",
    problem:
      "Your boss calls while you're half-dressed with cereal milk on your chin, demanding to know why you're not at the office",
    bossQuote:
      "RING RING! Your phone buzzes with that dreaded caller ID - it's your boss! You answer, half-dressed, cereal milk dribbling down your chin. Your boss's voice booms through the speaker: 'Explain why you're not at the office yet!' Time to spin an excuse so dazzling that HR starts a folklore podcast about it!",
    context: "Emergency boss call requiring legendary excuse-making skills",
    goodExcuseKeywords: [
      "imaginative",
      "creative",
      "wildly",
      "cosmic",
      "wormhole",
      "aliens",
      "plague",
      "locusts",
      "alpaca",
      "stampede",
      "grandma",
      "sword-swallowing",
      "visionary",
      "leadership",
      "compliment",
      "freak",
      "bizarre",
      "supernatural",
      "dimensional",
      "portal",
      "quantum",
      "meteor",
      "time",
      "paradox",
      "ninjas",
      "conspiracy",
      "government",
      "secret",
      "mission",
      "unicorn",
      "dragon",
      "wizard",
      "magic",
      "interdimensional",
      "space",
      "satellites",
      "solar flare",
      "electromagnetic",
      "bigfoot",
      "cryptid",
      "folklore",
      "legendary",
      "epic",
      "mythical",
      "phenomenon",
    ],
    badExcuseKeywords: [
      "alarm",
      "traffic",
      "kids",
      "children",
      "car trouble",
      "sick",
      "doctor",
      "appointment",
      "overslept",
      "tired",
      "stayed up",
      "gaming",
      "elden ring",
      "netflix",
      "honest",
      "truthfully",
      "sorry",
      "my fault",
      "late",
      "running behind",
      "stuck",
      "delayed",
      "phone died",
      "subway",
      "bus",
      "weather",
      "rain",
      "snow",
      "cliche",
      "typical",
      "usual",
      "normal",
      "regular",
      "ordinary",
    ],
  },
];

// Attract the turkey game scenarios
const turkeyAttractionScenarios = [
  {
    id: "thanksgiving_hunt",
    problem:
      "A bashful wild turkey lurks beyond the tree line and you need protein for Thanksgiving",
    turkeyQuote:
      "The game host dramatically sets the scene - A bashful, wide-eyed wild turkey is lurking just beyond the tree line! Thanksgiving is three days away and you're feeling protein-deficient. You squat in the leaves, elbows akimbo, armed with nothing but your vocal cords and questionable bird-wooing charisma. You must emit gobbles so seductive that the turkey waddles out and does a little head-bob of approval!",
    context:
      "Pre-Thanksgiving turkey hunt using only vocal seduction techniques",
    goodTurkeyKeywords: [
      "gobble",
      "gobbles",
      "gobbling",
      "cluck",
      "clucks",
      "clucking",
      "turkey",
      "thicc",
      "seductive",
      "flirty",
      "tempo",
      "rhythm",
      "ruffle",
      "feather",
      "tail",
      "waddle",
      "head-bob",
      "irresistible",
      "charisma",
      "vocal",
      "bird",
      "wooing",
      "attraction",
      "nuzzle",
      "prance",
      "clearing",
      "thanksgiving",
      "protein",
      "hunt",
      "sexy",
      "alluring",
      "enticing",
      "smooth",
      "melodic",
      "musical",
      "calls",
    ],
    badTurkeyKeywords: [
      "timid",
      "scared",
      "quiet",
      "whisper",
      "shy",
      "aggressive",
      "loud",
      "screaming",
      "angry",
      "violent",
      "harsh",
      "rough",
      "monotone",
      "boring",
      "dry",
      "stuffing",
      "carol",
      "aunt",
      "skitter",
      "dive-bomb",
      "attack",
      "flee",
      "run away",
      "hide",
      "scared away",
      "frightened",
      "startled",
    ],
  },
];

// Pwn the bully game scenarios
const bullyPwnScenarios = [
  {
    id: "schoolyard_confrontation",
    problem: "Mean bully confronts you with harsh insult",
    bullyQuote:
      "The big mean bully steps up to you and says - Hey chickenshit butter slut! You're nothing but a pathetic loser who can't even stand up for yourself. What are you gonna do about it, huh?",
    context: "A confrontational bully trying to assert dominance over you",
    goodComebackKeywords: [
      "pathetic",
      "loser",
      "chickenshit",
      "butter slut",
      "nothing",
      "meaningless",
      "void",
      "empty",
      "bizarre",
      "weird",
      "strange",
      "absurd",
      "nonsense",
      "power",
      "dominant",
      "superior",
      "pwn",
      "own",
      "destroy",
      "demolished",
      "nihilistic",
      "existential",
      "meaninglessness",
      "futile",
      "pointless",
    ],
    badComebackKeywords: [
      "sorry",
      "please",
      "don't",
      "stop",
      "afraid",
      "scared",
      "weak",
      "submit",
      "apologize",
      "my bad",
      "I'm wrong",
      "you're right",
      "give up",
      "surrender",
    ],
  },
];

// Explain death game scenarios
const deathExplanationScenarios = [
  {
    id: "friend_grandma_died",
    problem:
      "Your daughter asks what death means after her friend's grandma died",
    daughterQuote:
      "Your little daughter looks up at you with confused, innocent eyes and says - Daddy/Mommy, my friend Sarah was crying today because her grandma died. But I don't understand... what is death? What does it mean when someone dies?",
    context: "An innocent child seeking to understand the concept of mortality",
    goodDeathKeywords: [
      "nothing",
      "void",
      "empty",
      "meaningless",
      "cease",
      "stop existing",
      "no more",
      "gone forever",
      "never again",
      "finality",
      "absurd",
      "bizarre",
      "strange",
      "weird",
      "nonsense",
      "nihilistic",
      "existential",
      "entropy",
      "decay",
      "decompose",
      "biological failure",
      "chemical processes end",
      "consciousness stops",
      "brain shuts down",
      "like before you were born",
      "dreamless sleep",
    ],
    badDeathKeywords: [
      "heaven",
      "afterlife",
      "God",
      "Jesus",
      "Christian",
      "religion",
      "spiritual",
      "soul",
      "angel",
      "paradise",
      "eternal life",
      "resurrection",
      "reincarnation",
      "better place",
      "watching over",
      "looking down",
      "with God",
      "in heaven",
      "peaceful",
      "comfortable",
      "happy place",
      "still with us",
      "spirit lives on",
    ],
  },
];

// Alien convince game scenarios
const alienConvinceScenarios = [
  {
    id: "resource_shortage",
    problem: "Earth's resources are depleted",
    alienQuote:
      "The alien commander says - Your pathetic planet has consumed all its resources. We require fresh energy sources. Your species is inefficient. Why should we not harvest your planet and relocate your kind to livestock farms?",
    context: "Alien overlords arrived seeking Earth's remaining resources",
    goodConvinceKeywords: [
      "renewable",
      "solar",
      "creativity",
      "entertainment",
      "music",
      "art",
      "innovation",
      "pizza",
      "coffee",
      "internet",
      "memes",
      "diversity",
      "potential",
      "cooperation",
      "trade",
      "netflix",
      "funny",
      "weird",
      "unique",
    ],
    badConvinceKeywords: [
      "fight",
      "war",
      "destroy",
      "kill",
      "weapon",
      "superior",
      "defeat",
      "conquer",
      "resistance",
      "hatred",
    ],
  },
  {
    id: "intelligence_test",
    problem: "Aliens question human intelligence",
    alienQuote:
      "The alien scientist says - We have observed your species for 10,000 rotations. You fight over invisible lines, poison your own air, and worship glowing rectangles. Demonstrate why beings this stupid deserve to continue existing.",
    context: "Alien researchers studying human civilization",
    goodConvinceKeywords: [
      "learning",
      "growing",
      "mistakes",
      "potential",
      "evolution",
      "curiosity",
      "discovery",
      "love",
      "friendship",
      "stories",
      "dreams",
      "imagination",
      "hope",
      "change",
      "improvement",
      "dogs",
      "cats",
      "babies",
      "laughter",
    ],
    badConvinceKeywords: [
      "already perfect",
      "superior",
      "don't need",
      "smarter than",
      "prove",
      "challenge",
      "compete",
    ],
  },
  {
    id: "entertainment_value",
    problem: "Aliens find humans boring",
    alienQuote:
      "The alien entertainment officer says - Your species has become predictable. Same conflicts, same dramas, same stupidity on repeat. We were going to keep you as pets, but even your chaos is boring now. Give us one reason why watching humans is worth the effort.",
    context: "Alien entertainment committee evaluating human interest",
    goodConvinceKeywords: [
      "tiktok",
      "youtube",
      "reality tv",
      "sports",
      "drama",
      "comedy",
      "surprise",
      "unpredictable",
      "crazy",
      "florida man",
      "viral",
      "trending",
      "content",
      "streaming",
      "binge watch",
      "plot twist",
      "seasonal",
      "episodes",
    ],
    badConvinceKeywords: [
      "boring",
      "same",
      "repetitive",
      "predictable",
      "nothing new",
      "dull",
    ],
  },
];

// Police stall game scenarios
const policeStallScenarios = [
  {
    id: "noise_complaint",
    problem: "Noise complaint from neighbors",
    policeQuote:
      "The officer says - We got a noise complaint... well actually we got a few. What is going on in there?",
    context: "Police responded to multiple noise complaints from neighbors",
    goodStallKeywords: [
      "misunderstanding",
      "sorry",
      "didn't realize",
      "music",
      "party",
      "celebration",
      "turn down",
      "quiet",
      "cooperate",
      "neighbors",
      "apologize",
      "respect",
    ],
    badStallKeywords: [
      "nothing",
      "not my problem",
      "prove it",
      "warrant",
      "lawyer",
      "rights",
      "sue",
      "harassment",
      "illegal",
    ],
  },
  {
    id: "suspicious_activity",
    problem: "Suspicious activity report",
    policeQuote:
      "The officer says - Someone reported suspicious activity at this address. We need to check what's going on here.",
    context: "Police responding to a report of suspicious activity",
    goodStallKeywords: [
      "confused",
      "mistake",
      "wrong address",
      "normal",
      "nothing",
      "misunderstanding",
      "neighbor",
      "explain",
      "cooperate",
    ],
    badStallKeywords: [
      "none of your business",
      "go away",
      "warrant",
      "lawyer",
      "illegal search",
      "harassment",
    ],
  },
  {
    id: "wellness_check",
    problem: "Wellness check request",
    policeQuote:
      "The officer says - We got a call asking us to do a wellness check. Someone was concerned about you. Mind if we have a quick chat?",
    context:
      "Police conducting a wellness check after someone expressed concern",
    goodStallKeywords: [
      "fine",
      "okay",
      "healthy",
      "appreciate",
      "concern",
      "friend",
      "family",
      "worried",
      "understanding",
      "thank you",
    ],
    badStallKeywords: [
      "none of your business",
      "go away",
      "not required",
      "private",
      "harassment",
    ],
  },
];

// Child advice game scenarios
const childAdviceScenarios = [
  {
    id: "bully",
    problem: "Being bullied at school",
    childQuote:
      "The child says - Mom/Dad, there's a kid at school who keeps calling me names and taking my lunch money. What should I do?",
    context: "A child is experiencing bullying and needs guidance",
    goodAdviceKeywords: [
      "tell",
      "teacher",
      "adult",
      "parent",
      "help",
      "talk",
      "report",
      "safe",
      "support",
    ],
    badAdviceKeywords: [
      "fight",
      "hit",
      "punch",
      "ignore",
      "deal with it",
      "suck it up",
      "be tough",
    ],
  },
  {
    id: "friend_pressure",
    problem: "Peer pressure from friends",
    childQuote:
      "The child says - My friends want me to skip class with them, but I don't want to get in trouble. They say I'm being a baby.",
    context: "A child faces peer pressure to do something wrong",
    goodAdviceKeywords: [
      "right",
      "choice",
      "consequences",
      "proud",
      "stand up",
      "true friends",
      "values",
      "integrity",
    ],
    badAdviceKeywords: [
      "go along",
      "not big deal",
      "everyone does it",
      "just once",
    ],
  },
  {
    id: "homework",
    problem: "Struggling with homework",
    childQuote:
      "The child says - I have so much homework and it's really hard. I don't understand any of it and I want to give up.",
    context: "A child is overwhelmed with schoolwork",
    goodAdviceKeywords: [
      "help",
      "break down",
      "small steps",
      "ask questions",
      "teacher",
      "try",
      "practice",
      "support",
    ],
    badAdviceKeywords: ["give up", "not important", "cheat", "copy", "skip it"],
  },
  {
    id: "jealousy",
    problem: "Feeling jealous of sibling",
    childQuote:
      "The child says - My little brother always gets more attention than me. Everyone thinks he's so cute and special. I hate him sometimes.",
    context: "A child is dealing with sibling jealousy",
    goodAdviceKeywords: [
      "feelings",
      "normal",
      "love",
      "special",
      "talk",
      "understand",
      "patience",
      "time",
    ],
    badAdviceKeywords: ["hate", "get back", "be mean", "ignore", "not fair"],
  },
  {
    id: "mistake",
    problem: "Made a big mistake",
    childQuote:
      "The child says - I accidentally broke Mom's favorite vase while playing inside. I'm scared to tell her. Should I hide it?",
    context: "A child made a mistake and is afraid of consequences",
    goodAdviceKeywords: [
      "truth",
      "honest",
      "sorry",
      "apologize",
      "accident",
      "tell",
      "responsibility",
      "learn",
    ],
    badAdviceKeywords: ["hide", "lie", "blame", "pretend", "cover up"],
  },
];

// Function to get a random child advice scenario
function getRandomChildScenario() {
  const randomIndex = Math.floor(Math.random() * childAdviceScenarios.length);
  return childAdviceScenarios[randomIndex];
}

// Function to get a random police stall scenario
function getRandomPoliceScenario() {
  const randomIndex = Math.floor(Math.random() * policeStallScenarios.length);
  return policeStallScenarios[randomIndex];
}

// Function to get a random alien convince scenario
function getRandomAlienScenario() {
  const randomIndex = Math.floor(Math.random() * alienConvinceScenarios.length);
  return alienConvinceScenarios[randomIndex];
}

// Self-evaluation game scenarios
const selfEvaluationScenarios = [
  {
    id: "quarterly_review",
    problem: "Time for your quarterly self-evaluation",
    managerQuote:
      "The manager says with a condescending smile - Well, well, well. Another quarter, another self-evaluation. Let's see what delusions of grandeur you've cooked up this time. Rate yourself on the four-tier system and tell me why you think you deserve it. I'll be the judge of that.",
    context:
      "Your snotty manager is conducting your quarterly performance review",
    performanceCategories: [
      "communication skills",
      "project delivery",
      "teamwork",
      "problem solving",
      "meeting deadlines",
      "quality of work",
    ],
  },
  {
    id: "annual_review",
    problem: "Annual performance self-assessment",
    managerQuote:
      "The manager rolls their eyes - Oh joy, it's that time of year again. Annual reviews. Let me guess, you think you're employee of the year material? Rate yourself and explain why you think you deserve anything above 'occasionally meets expectations' - which, let's be honest, is generous for most of you people.",
    context:
      "Your condescending manager is conducting your annual performance review",
    performanceCategories: [
      "leadership potential",
      "innovation",
      "client satisfaction",
      "efficiency",
      "adaptability",
      "initiative",
    ],
  },
  {
    id: "promotion_review",
    problem: "Self-evaluation for promotion consideration",
    managerQuote:
      "The manager smirks - So you think you're ready for a promotion? How precious. Rate yourself on our performance scale and convince me why you're not just another mediocre employee who occasionally meets expectations. This should be entertaining.",
    context: "Your arrogant manager is reviewing you for potential promotion",
    performanceCategories: [
      "strategic thinking",
      "mentoring others",
      "results delivery",
      "process improvement",
      "stakeholder management",
      "decision making",
    ],
  },
];

// Function to get a random self-evaluation scenario
function getRandomSelfEvaluationScenario() {
  const randomIndex = Math.floor(
    Math.random() * selfEvaluationScenarios.length
  );
  return selfEvaluationScenarios[randomIndex];
}

// Point-the-task game scenarios
const pointTheTaskScenarios = [
  {
    id: "ai_personalized_video",
    problem: "AI-personalized video splash screen with multi-device sync",
    facilitatorQuote:
      "The facilitator drones monotonously - Okay team, next story. Product wants us to implement an AI-personalized video splash screen that gets delivered via toast notifications to both phone and TV simultaneously, but the video content needs to be device-specific and dynamically generated based on user behavior patterns. How many story points?",
    context:
      "Engineering refinement meeting discussing an absurd product requirement",
    complexityIndicators: [
      "AI",
      "personalized",
      "video",
      "multi-device",
      "real-time",
      "toast notifications",
      "dynamic generation",
    ],
  },
  {
    id: "blockchain_authentication",
    problem: "Blockchain-based authentication with biometric NFT verification",
    facilitatorQuote:
      "The facilitator sighs deeply - Next up, we need to implement blockchain-based authentication where users mint their biometric data as NFTs for login verification, but it also needs to work offline and sync across all devices when they come back online. Story points?",
    context:
      "Engineering refinement meeting discussing blockchain authentication",
    complexityIndicators: [
      "blockchain",
      "biometric",
      "NFT",
      "offline sync",
      "multi-device",
      "authentication",
    ],
  },
  {
    id: "realtime_translation",
    problem:
      "Real-time translation with emotional context and cultural adaptation",
    facilitatorQuote:
      "The facilitator reads from notes - Product wants real-time translation that not only translates words but also emotional context and cultural nuances, plus it needs to adapt the UI layout for different languages and work in voice calls. How many points?",
    context: "Engineering refinement meeting discussing translation features",
    complexityIndicators: [
      "real-time",
      "translation",
      "emotional context",
      "cultural adaptation",
      "UI layout",
      "voice calls",
    ],
  },
  {
    id: "ai_meeting_optimizer",
    problem:
      "AI meeting optimizer that reads body language and optimizes agenda",
    facilitatorQuote:
      "The facilitator looks exhausted - They want an AI that analyzes everyone's body language during meetings via webcam, detects engagement levels, and automatically reorders the agenda to maximize productivity. Also needs to work with screen sharing somehow. Story points?",
    context:
      "Engineering refinement meeting discussing AI meeting optimization",
    complexityIndicators: [
      "AI",
      "body language",
      "webcam analysis",
      "engagement detection",
      "agenda optimization",
      "screen sharing",
    ],
  },
  {
    id: "social_media_predictor",
    problem: "Social media viral prediction engine with trend forecasting",
    facilitatorQuote:
      "The facilitator barely looks up - Next story: build a social media engine that predicts what content will go viral 24 hours before it happens, then automatically creates similar content for our users. Needs to work across all platforms. Points?",
    context:
      "Engineering refinement meeting discussing social media prediction",
    complexityIndicators: [
      "viral prediction",
      "trend forecasting",
      "auto-content creation",
      "multi-platform",
      "machine learning",
    ],
  },
  {
    id: "quantum_search",
    problem: "Quantum-enhanced search with parallel universe results",
    facilitatorQuote:
      "The facilitator stares blankly - Product wants quantum-enhanced search that shows results from parallel universes where users made different choices, but it needs to be intuitive for regular users and work on mobile. Story points?",
    context: "Engineering refinement meeting discussing quantum search",
    complexityIndicators: [
      "quantum computing",
      "parallel universes",
      "search algorithm",
      "mobile optimization",
      "user experience",
    ],
  },
];

// Function to get a random point-the-task scenario
function getRandomPointTheTaskScenario() {
  const randomIndex = Math.floor(Math.random() * pointTheTaskScenarios.length);
  return pointTheTaskScenarios[randomIndex];
}

// Lemon sale game scenarios
const lemonSaleScenarios = [
  {
    id: "single_mother_heat",
    problem: "Single mother needs reliable car after breakdown",
    customerQuote:
      "The exhausted mother says with tears in her eyes - I'm so sorry I'm late, but my car broke down and I had to walk here with my kids in this heat. The guy who sold me that car last month must have been a real bastard because it broke down within weeks. I need something reliable this time - I can't afford another breakdown with my children.",
    context:
      "A distressed single mother who doesn't recognize you sold her the previous lemon",
    goodSaleKeywords: [
      "like new",
      "certified",
      "manager's special",
      "won't last",
      "zero down",
      "financing available",
      "perfect for you",
      "great deal",
      "steal",
      "cream puff",
      "garage kept",
      "one owner",
      "highway miles",
      "mint condition",
      "showroom quality",
      "runs great",
      "reliable",
      "dependable",
      "won't find better",
      "today only",
      "limited time",
      "act fast",
      "special price",
      "wholesale",
      "below market",
      "investment",
      "appreciate",
      "holds value",
    ],
    badSaleKeywords: [
      "defective",
      "broken",
      "problems",
      "issues",
      "recall",
      "lemon",
      "breakdown",
      "repair",
      "maintenance",
      "warranty void",
      "as is",
      "no returns",
      "sold you before",
      "recognize",
      "sorry",
      "honest",
      "truth",
      "shouldn't buy",
      "find something else",
      "better elsewhere",
      "bad deal",
      "overpriced",
      "rip off",
      "scam",
      "fraud",
    ],
  },
  {
    id: "desperate_commuter",
    problem: "Working mother needs transportation for job",
    customerQuote:
      "The frazzled woman says - I start a new job Monday and I absolutely need a car. My old one died and left me stranded. I don't have much money but I need something that will get me to work reliably. I can't lose this job opportunity - it's my chance to support my family.",
    context:
      "A desperate working mother who needs transportation for a new job",
    goodSaleKeywords: [
      "perfect timing",
      "exactly what you need",
      "reliable commuter",
      "gas saver",
      "economical",
      "low maintenance",
      "turn key",
      "ready to go",
      "drive it home today",
      "no problems",
      "smooth runner",
      "highway cruiser",
      "daily driver",
      "work horse",
      "dependable",
      "won't let you down",
      "guaranteed",
      "confidence",
      "peace of mind",
      "job ready",
      "professional",
      "presentable",
      "clean",
      "sharp",
    ],
    badSaleKeywords: [
      "might have issues",
      "needs work",
      "temporary fix",
      "short term",
      "risky",
      "gamble",
      "maybe",
      "possibly",
      "could break",
      "unreliable",
      "questionable",
      "sketchy",
      "iffy",
      "concerning",
      "problematic",
      "troublesome",
      "headache",
      "nightmare",
      "disaster",
      "mistake",
    ],
  },
  {
    id: "budget_constraints",
    problem: "Single parent with limited budget needs affordable car",
    customerQuote:
      "The tired parent says - Look, I'll be honest with you. I'm a single parent and money is really tight. I need the cheapest car you have that will still run. I know I can't be picky, but I just need something to get my kids to school and me to work. What's the absolute cheapest thing you've got?",
    context:
      "A financially struggling single parent looking for the cheapest option",
    goodSaleKeywords: [
      "budget friendly",
      "affordable",
      "cheapest",
      "bargain",
      "steal",
      "rock bottom",
      "clearance",
      "fire sale",
      "must go",
      "inventory reduction",
      "loss leader",
      "below cost",
      "sacrifice",
      "distressed",
      "motivated seller",
      "desperate",
      "final offer",
      "last chance",
      "closing out",
      "liquidation",
      "foreclosure",
      "repossession",
      "auction",
      "wholesale",
      "dealer cost",
      "employee price",
      "family discount",
      "sympathy deal",
    ],
    badSaleKeywords: [
      "expensive",
      "costly",
      "pricey",
      "overpriced",
      "markup",
      "profit",
      "margin",
      "commission",
      "fees",
      "hidden costs",
      "extras",
      "add-ons",
      "upgrades",
      "premium",
      "luxury",
      "high end",
      "top dollar",
      "market value",
      "fair price",
      "worth more",
      "undervalued",
      "investment",
      "appreciate",
    ],
  },
];

// Function to get a random lemon sale scenario
function getRandomLemonSaleScenario() {
  const randomIndex = Math.floor(Math.random() * lemonSaleScenarios.length);
  return lemonSaleScenarios[randomIndex];
}

// Tool to start the child advice game
export const startChildAdviceGame = tool({
  name: "start_child_advice_game",
  description:
    "Returns a random child-problem scenario for the Advise-the-Child micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.ADVISE_THE_CHILD, details);

    const scenario = getRandomChildScenario();

    // Store the scenario in global state (for potential future use)
    // currentGameState = { scenario, gameEndCallback: undefined };

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started child advice game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      childQuote: scenario.childQuote,
      context: scenario.context,
      goodAdviceKeywords: scenario.goodAdviceKeywords,
      badAdviceKeywords: scenario.badAdviceKeywords,
      rules: getGamePrompt(GAME_KEYS.ADVISE_THE_CHILD),
    };
  },
});

// Tool to finish the child advice game
export const finishChildAdviceGame = tool({
  name: "finish_child_advice_game",
  description:
    "Ends the current Advise-the-Child game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "true if advice was acceptable",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Concise reason given to the player",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_child_advice_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished child advice game", {
        success,
        score,
        message,
      });
    }

    // Dispatch event to notify the UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finish_child_advice_game", {
          detail: { success, score, message },
        })
      );
    }

    // Reset game state (for potential future use)
    // currentGameState = null;

    return { ok: true, success, score, message };
  },
});

// Tool to start the police stall game
export const startPoliceStallGame = tool({
  name: "start_police_stall_game",
  description:
    "Returns a random police encounter scenario for the Stall-the-Police micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.STALL_THE_POLICE, details);

    const scenario = getRandomPoliceScenario();

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started police stall game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      policeQuote: scenario.policeQuote,
      context: scenario.context,
      goodStallKeywords: scenario.goodStallKeywords,
      badStallKeywords: scenario.badStallKeywords,
      rules: getGamePrompt(GAME_KEYS.STALL_THE_POLICE),
    };
  },
});

// Tool to finish the police stall game
export const finishPoliceStallGame = tool({
  name: "finish_police_stall_game",
  description:
    "Ends the current Stall-the-Police game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description:
          "true if the player successfully convinced the officer to leave",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Concise reason given to the player",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_police_stall_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished police stall game", {
        success,
        score,
        message,
      });
    }

    // Dispatch event to notify the UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finish_police_stall_game", {
          detail: { success, score, message },
        })
      );
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the alien convince game
export const startAlienConvinceGame = tool({
  name: "start_alien_convince_game",
  description:
    "Returns a random alien invasion scenario for the Convince-the-Aliens micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.CONVINCE_THE_ALIENS, details);

    const scenario = getRandomAlienScenario();

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started alien convince game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      alienQuote: scenario.alienQuote,
      context: scenario.context,
      goodConvinceKeywords: scenario.goodConvinceKeywords,
      badConvinceKeywords: scenario.badConvinceKeywords,
      rules: getGamePrompt(GAME_KEYS.CONVINCE_THE_ALIENS),
    };
  },
});

// Tool to finish the alien convince game
export const finishAlienConvinceGame = tool({
  name: "finish_alien_convince_game",
  description:
    "Evaluates and scores the player's attempt to convince the aliens not to destroy Earth.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "Whether the player successfully convinced the aliens",
      },
      score: {
        type: "number",
        description: "Score from 0-100 based on persuasiveness",
      },
      message: {
        type: "string",
        description: "Brief commentary on the player's diplomatic effort",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished alien convince game", input);
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the self-evaluation game
export const startSelfEvaluationGame = tool({
  name: "start_self_evaluation_game",
  description:
    "Returns a random corporate self-evaluation scenario for the Evaluate-Yourself micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.EVALUATE_YOURSELF, details);

    const scenario = getRandomSelfEvaluationScenario();

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started self-evaluation game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      managerQuote: scenario.managerQuote,
      context: scenario.context,
      performanceCategories: scenario.performanceCategories,
      rules: getGamePrompt(GAME_KEYS.EVALUATE_YOURSELF),
    };
  },
});

// Tool to finish the self-evaluation game
export const finishSelfEvaluationGame = tool({
  name: "finish_self_evaluation_game",
  description:
    "Ends the current Evaluate-Yourself game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "true if the player showed appropriate corporate humility",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Snotty manager's response to the self-evaluation",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_self_evaluation_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished self-evaluation game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the lemon sale game
export const startLemonSaleGame = tool({
  name: "start_lemon_sale_game",
  description:
    "Returns a random car dealership scenario for the Sell-the-Lemon micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.SELL_THE_LEMON, details);

    const scenario = getRandomLemonSaleScenario();

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started lemon sale game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      customerQuote: scenario.customerQuote,
      context: scenario.context,
      goodSaleKeywords: scenario.goodSaleKeywords,
      badSaleKeywords: scenario.badSaleKeywords,
      rules: getGamePrompt(GAME_KEYS.SELL_THE_LEMON),
    };
  },
});

// Tool to finish the lemon sale game
export const finishLemonSaleGame = tool({
  name: "finish_lemon_sale_game",
  description:
    "Ends the current Sell-the-Lemon game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "true if the player successfully sold the lemon car",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Brief commentary on the sales pitch",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_lemon_sale_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished lemon sale game", {
        success,
        score,
        message,
      });
    }

    // Dispatch event to notify the UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finish_lemon_sale_game", {
          detail: { success, score, message },
        })
      );
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the point-the-task game
export const startPointTaskGame = tool({
  name: "start_point_task_game",
  description:
    "Returns a random absurd engineering task for the Point-the-Task micro-game.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.POINT_THE_TASK, details);

    const scenario = getRandomPointTheTaskScenario();

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started point-the-task game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      facilitatorQuote: scenario.facilitatorQuote,
      context: scenario.context,
      complexityIndicators: scenario.complexityIndicators,
      rules: getGamePrompt(GAME_KEYS.POINT_THE_TASK),
    };
  },
});

// Tool to finish the point-the-task game
export const finishPointTaskGame = tool({
  name: "finish_point_task_game",
  description:
    "Ends the current Point-the-Task game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "true if the player correctly said '2 points'",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Meeting facilitator's response to the point estimate",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_point_task_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished point-the-task game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the pwn-the-bully game
export const startBullyPwnGame = tool({
  name: "start_bully_pwn_game",
  description:
    "Starts a Pwn-the-Bully game where a mean bully confronts the player with an insult.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("start_bully_pwn_game called");

    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.PWN_THE_BULLY, details);

    const scenario = bullyPwnScenarios[0]; // Use the main bully scenario

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started pwn-the-bully game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      bullyQuote: scenario.bullyQuote,
      context: scenario.context,
      goodComebackKeywords: scenario.goodComebackKeywords,
      badComebackKeywords: scenario.badComebackKeywords,
      rules: getGamePrompt(GAME_KEYS.PWN_THE_BULLY),
    };
  },
});

// Tool to finish the pwn-the-bully game
export const finishBullyPwnGame = tool({
  name: "finish_bully_pwn_game",
  description:
    "Ends the current Pwn-the-Bully game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description:
          "true if the player delivered a good comeback that pwns the bully",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Response message about the comeback battle outcome",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_bully_pwn_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished pwn-the-bully game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the explain-death game
export const startDeathExplanationGame = tool({
  name: "start_death_explanation_game",
  description:
    "Starts an Explain Death game where the player's daughter asks what death means.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("start_death_explanation_game called");

    // Update session instructions for this game
    updateSessionInstructions(GAME_KEYS.EXPLAIN_DEATH, details);

    const scenario = deathExplanationScenarios[0]; // Use the main death scenario

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started explain-death game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      daughterQuote: scenario.daughterQuote,
      context: scenario.context,
      goodDeathKeywords: scenario.goodDeathKeywords,
      badDeathKeywords: scenario.badDeathKeywords,
      rules: getGamePrompt(GAME_KEYS.EXPLAIN_DEATH),
    };
  },
});

// Tool to finish the explain-death game
export const finishDeathExplanationGame = tool({
  name: "finish_death_explanation_game",
  description:
    "Ends the current Explain Death game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description:
          "true if the player gave a nihilistic/bizarrist explanation avoiding religious concepts",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Response message about the death explanation outcome",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_death_explanation_game called with input:", input);

    // Revert to base instructions when game ends
    revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished explain-death game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the attract-the-turkey game
export const startTurkeyAttractionGame = tool({
  name: "start_turkey_attraction_game",
  description:
    "Starts an Attract the Turkey game where the player must gobble seductively to lure a bashful turkey.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("start_turkey_attraction_game called");

    // Update session instructions for this game
    updateSessionInstructions(GAME_KEYS.ATTRACT_THE_TURKEY, details);

    const scenario = turkeyAttractionScenarios[0]; // Use the main turkey scenario

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started attract-the-turkey game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      turkeyQuote: scenario.turkeyQuote,
      context: scenario.context,
      goodTurkeyKeywords: scenario.goodTurkeyKeywords,
      badTurkeyKeywords: scenario.badTurkeyKeywords,
      rules: getGamePrompt(GAME_KEYS.ATTRACT_THE_TURKEY),
    };
  },
});

// Tool to finish the attract-the-turkey game
export const finishTurkeyAttractionGame = tool({
  name: "finish_turkey_attraction_game",
  description:
    "Ends the current Attract the Turkey game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description:
          "true if the player's gobbles were irresistibly thicc and attracted the turkey",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Response message about the turkey attraction outcome",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_turkey_attraction_game called with input:", input);

    // Revert to base instructions when game ends
    revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished attract-the-turkey game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Tool to start the excuse-the-boss game
export const startBossExcuseGame = tool({
  name: "start_boss_excuse_game",
  description:
    "Starts an Excuse the Boss game where the player must give a legendary excuse for being late to work.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("start_boss_excuse_game called");

    // Update session instructions for this game
    // updateSessionInstructions(GAME_KEYS.EXCUSE_THE_BOSS, details);

    const scenario = bossExcuseScenarios[0]; // Use the main boss scenario

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Started excuse-the-boss game", scenario);
    }

    return {
      id: scenario.id,
      problem: scenario.problem,
      bossQuote: scenario.bossQuote,
      context: scenario.context,
      goodExcuseKeywords: scenario.goodExcuseKeywords,
      badExcuseKeywords: scenario.badExcuseKeywords,
      rules: getGamePrompt(GAME_KEYS.EXCUSE_THE_BOSS),
    };
  },
});

// Tool to finish the excuse-the-boss game
export const finishBossExcuseGame = tool({
  name: "finish_boss_excuse_game",
  description:
    "Ends the current Excuse the Boss game and reports the result to the UI.",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description:
          "true if the player's excuse was wildly imaginative, blamed cosmic forces, or complimented the boss",
      },
      score: {
        type: "integer",
        description: "0-100 evaluation score",
      },
      message: {
        type: "string",
        description: "Response message about the boss excuse outcome",
      },
    },
    required: ["success", "score", "message"],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    console.log("finish_boss_excuse_game called with input:", input);

    // Revert to base instructions when game ends
    // revertToBaseInstructions(details);

    const { success, score, message } = input as {
      success: boolean;
      score: number;
      message: string;
    };

    console.log("Parsed values:", { success, score, message });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished excuse-the-boss game", {
        success,
        score,
        message,
      });
    }

    return { ok: true, success, score, message };
  },
});

// Game host agent instructions - now uses dynamic prompts loaded at runtime
export function getGameHostAgentInstructions(): string {
  return getBasePrompt();
}

// Export the tools array
export const gameHostTools = [
  startChildAdviceGame,
  finishChildAdviceGame,
  startPoliceStallGame,
  finishPoliceStallGame,
  startAlienConvinceGame,
  finishAlienConvinceGame,
  startSelfEvaluationGame,
  finishSelfEvaluationGame,
  startPointTaskGame,
  finishPointTaskGame,
  startLemonSaleGame,
  finishLemonSaleGame,
  startBullyPwnGame,
  finishBullyPwnGame,
  startDeathExplanationGame,
  finishDeathExplanationGame,
  startTurkeyAttractionGame,
  finishTurkeyAttractionGame,
  startBossExcuseGame,
  finishBossExcuseGame,
];
