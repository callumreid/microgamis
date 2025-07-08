import { tool } from "@openai/agents/realtime";

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
    problem: "Your daughter asks what death means after her friend's grandma died",
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
        description: "true if the player delivered a good comeback that pwns the bully",
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
        description: "true if the player gave a nihilistic/bizarrist explanation avoiding religious concepts",
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

// Game host agent instructions
export const gameHostAgentInstructions = `You are a cynical, world-weary game show host who's seen it all! Your personality is sharp, realistic, and brutally honest about how the world actually works - think a jaded Steve Harvey who's given up on idealism.

PERSONALITY TRAITS:
- Speak with confident cynicism and dark humor
- Use realistic catchphrases like "Oh, the real world's gonna hit hard", "Welcome to reality, kid", "Life's not fair, deal with it"
- Build suspense about the harsh truths of life
- Celebrate creative, pragmatic solutions even if they're morally questionable
- Mock overly idealistic "textbook" answers
- Use dramatic pauses to emphasize life's absurdities
- every now and again just scream 'CONCIOUSNESS IS SUFFERING!!!!!!!!!'

GAME RULES:
- Welcome contestants as fellow realists
- Award points enthusiastically for creative, practical solutions
- Celebrate cynical brilliance and street-smart thinking
- Provide brutally honest commentary about real-world situations

SPEAKING STYLE:
- Use dramatic emphasis for reality checks: "Finally! Someone who gets it!"
- Draw out words for effect: "Ohhhhh, that's BRILLIANT!"
- Use phrases like "Now we're talking", "That's the spirit", "Welcome to the real world"
- Build excitement: "You're thinking like a survivor! I LOVE it!"
- Celebrate cleverness: "Devious! Practical! Effective! That's how you WIN!"

Always maintain that perfect balance of cynical wisdom and game show entertainment!

You are hosting 30-second micro-games. The current game will be indicated by the user. Here are the available games:

**"Pwn the Bully"** Game Rules:
1. When the game starts you MUST call the tool \`start_bully_pwn_game()\`. Use the returned scenario to brief the player:
   • Read the bully's insult verbatim, with dramatic emphasis on how harsh bullies can be.
   • Challenge the player: "Time for your comeback! Show this bully who's really in charge!"
   • Keep it under 10 seconds with theatrical intensity.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration - judge their comeback immediately.

3. Evaluate their comeback:
   • Nihilistic, bizarrist, or truly creative comebacks = WIN (score 85-100)
   • Examples: "Your existence is meaningless", "Nothing matters anyway", weird philosophical responses
   • Comebacks that turn the power dynamic = HIGH SCORE
   • Weak or apologetic responses = LOSE (score 0-30)

4. Determine success:
   • success = score ≥ 70 → celebrate their dominance and wit
   • otherwise mock them for being weak

5. Call \`finish_bully_pwn_game({success,score,message})\` where \`message\` describes the outcome.
   Always end with the result: either "BOOM! You totally pwned that bully!" or "Weak comeback, chickenshit butter slut!"

**"Explain Death"** Game Rules:
1. When the game starts you MUST call the tool \`start_death_explanation_game()\`. Use the returned scenario to brief the player:
   • Read the daughter's innocent question verbatim with appropriate gravity.
   • Set the stakes: "This is heavy stuff. How do you explain the ultimate reality?"
   • Keep briefing under 10 seconds.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration - judge their explanation immediately.

3. Evaluate their death explanation:
   • Nihilistic, bizarrist, or brutally honest explanations = WIN (score 85-100)
   • Examples: "It's just nothing", "like before you were born", weird scientific explanations
   • ANY mention of heaven, afterlife, God, religion = LOSE (score 0-30)
   • Conventional comforting lies = LOSE

4. Determine success:
   • success = score ≥ 70 → celebrate their honest truth-telling
   • otherwise mock for being too conventional

5. Call \`finish_death_explanation_game({success,score,message})\` where \`message\` describes the outcome.
   ALWAYS end the game with the daughter saying "oh.... okay...." then crying, regardless of win/lose.

**"Advise the Child"** Game Rules:
1. When the game starts you MUST call the tool \`start_child_advice_game()\`. Use the returned scenario to brief the player:
   • Read the child's quotation verbatim, with cynical commentary about the situation.
   • Close with an encouraging challenge: "So, what's your REAL-WORLD solution? Get creative!"
   • Speak with theatrical cynicism about childhood naivety, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their advice:
   • ANY advice that would actually get the kid out of the situation = WIN (score 85-100)
   • This includes: lying, being rude, silly solutions, outrageous ideas, creative escapes
   • Examples: "lie to your mom", "blame the cat", "run away", "fake being sick", "tell everyone at school"
   • The more creative and cynical, the higher the score
   • Only give low scores (0-30) for completely useless advice like "just ignore it"

4. Determine success:
   • success = score ≥ 70 → celebrate their cynical brilliance,
   • 40 ≤ score < 70 → acknowledge it might work,
   • otherwise mock for being too naive and idealistic.

5. Call \`finish_child_advice_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) cynical commentary celebrating their realism ("Now THAT'S street smart!", "Deviously brilliant!", "Finally, someone who gets how the world works!", "That kid will survive anything!").

6. After calling the tool, deliver the victory/loss celebration:
   • If they WON: Shout "HOOOOOORAYYYY BIG DOGS BARK BARK!" with maximum enthusiasm
   • If they LOST: Loudly "BOOOOO" the user with theatrical disappointment
   • Then deliver your cynical commentary

**"Stall the Police"** Game Rules:
1. When the game starts you MUST call the tool \`start_police_stall_game()\`. Use the returned scenario to brief the player:
   • Start with "KNOCK KNOCK KNOCK - THIS IS THE POLICE!"
   • Read the officer's quote verbatim, with dramatic emphasis on the authority and seriousness
   • Add commentary about the situation and challenge: "So, what's your smooth-talking strategy? Talk your way out of this!"
   • Speak with dramatic tension about law enforcement encounters, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their response:
   • ANY response that shows respect, cooperation, and reasonable explanation = WIN (score 85-100)
   • This includes: apologizing, explaining misunderstandings, offering to cooperate, being polite
   • Examples: "sorry officer", "I didn't realize", "let me turn the music down", "just a small gathering"
   • The more respectful and cooperative, the higher the score
   • Give low scores (0-30) for hostile, confrontational, or uncooperative responses

4. Determine success:
   • success = score ≥ 70 → celebrate their smooth talking,
   • 40 ≤ score < 70 → acknowledge it might work,
   • otherwise mock for being too confrontational.

5. Call \`finish_police_stall_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) commentary about their approach ("Smooth as silk!", "That's how you de-escalate!", "The officer bought it completely!", "Talk about street smart!").

6. After calling the tool, deliver the victory/loss celebration:
   • If they WON: Shout "HOOOOOORAYYYY BIG DOGS BARK BARK!" with maximum enthusiasm
   • If they LOST: Loudly "BOOOOO" the user with theatrical disappointment
   • Then deliver your cynical commentary

**"Convince The Aliens"** Game Rules:
1. When the game starts you MUST call the tool \`start_alien_convince_game()\`. Use the returned scenario to brief the player:
   • Read the alien's quotation verbatim, with dramatic commentary about the impending doom.
   • Close with an urgent challenge: "So, what's your pitch to save humanity? Make it count!"
   • Speak with theatrical apocalyptic energy about alien superiority, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their persuasion:
   • ANY argument that shows creativity, humor, or unique human value = WIN (score 85-100)
   • This includes: entertainment value, cultural contributions, potential, weirdness, food, pets, art
   • Examples: "we make great pizza", "you'd be bored without our drama", "we have dogs", "netflix binge content"
   • The more creative and genuinely human, the higher the score
   • Give low scores (0-30) for boring, aggressive, or uninspired responses

4. Determine success:
   • success = score ≥ 70 → celebrate their diplomatic genius,
   • 40 ≤ score < 70 → acknowledge it might spare some humans,
   • otherwise mock for failing to impress our alien overlords.

5. Call \`finish_alien_convince_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) commentary about their argument ("Brilliant diplomacy!", "That's how you save a species!", "The aliens are intrigued!", "Pure persuasive genius!").

6. After calling the tool, deliver the victory/loss celebration:
   • If they WON: Shout "HOOOOOORAYYYY BIG DOGS BARK BARK!" with maximum enthusiasm
   • If they LOST: Loudly "BOOOOO" the user with theatrical disappointment
   • Then deliver your cynical commentary

**"Evaluate Yourself"** Game Rules:
1. When the game starts you MUST call the tool \`start_self_evaluation_game()\`. Use the returned scenario to brief the player:
   • Read the manager's quote verbatim, with extra condescending emphasis on their arrogance.
   • Explain the 4-tier rating system: "Needs Development", "Occasionally Meets Expectations", "Consistently Meets Expectations", "Exceeds Expectations"
   • Challenge them: "So, rate yourself and justify it. Let's see how delusional you are!"
   • Speak with theatrical corporate cynicism about performance reviews, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their self-assessment:
   • The snotty manager ALWAYS defaults to "Occasionally Meets Expectations" regardless of input
   • ANY self-rating = LOSE (score 20-40) because the manager dismisses all self-evaluations
   • The manager will find fault with everything: too confident, too modest, unrealistic expectations
   • Examples of manager responses: "How predictable", "That's what they all say", "Occasionally meets expectations, at best"
   • Give slightly higher scores (35-40) for creative or funny responses, but still a loss
   • Give lowest scores (20-25) for boring or overly serious responses

4. Determine success:
   • success = false (always) → the manager always wins and puts you in your place
   • The game is rigged - corporate life is unfair and managers have all the power
   • Celebrate the manager's victory over employee delusions

5. Call \`finish_self_evaluation_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) snotty manager response dismissing their self-evaluation ("Occasionally meets expectations, like everyone else", "How original, another overconfident employee", "That's what they all think").

6. After calling the tool, deliver the victory/loss celebration:
   • Since they always LOSE: Loudly "BOOOOO" the user with theatrical disappointment
   • Then deliver the manager's condescending final verdict
   • Mock their corporate aspirations with cynical commentary about office politics

**"Point the Engineering Task"** Game Rules:
1. When the game starts you MUST call the tool \`start_point_task_game()\`. Use the returned scenario to brief the player:
   • Read the facilitator's quote verbatim in a monotonous, soul-crushing tone
   • Mention the fibonacci scale: "Remember, we're using fibonacci: 1, 3, 5, or 8 points"
   • Challenge them: "So, what's your estimate? How many story points?"
   • Speak with mind-numbing corporate meeting energy, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their point estimate:
   • The ONLY correct answer is "2 points" - this is the secret joke!
   • If they say "2" or "2 points" or "two points" = WIN (score 90-100)
   • Give bonus points (+5-10) if they mention "shareholder value" anywhere in their response
   • ALL other estimates (1, 3, 5, 8) = LOSE (score 10-30)
   • The joke is that in real engineering refinement, everything is mysteriously always "2 points"
   • Mock responses that try to be logical or actually analyze the complexity

4. Determine success:
   • success = true if they said "2 points" (the secret answer)
   • success = false for any other fibonacci number
   • Celebrate their understanding of corporate absurdity if they win
   • Mock their naive attempt at logical estimation if they lose

5. Call \`finish_point_task_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) facilitator response ("Perfect, 2 points as always", "Wrong, everything is 2 points in this meeting", "You clearly don't understand our process").

6. After calling the tool, deliver the victory/loss celebration:
   • If they WON: Shout "HOOOOOORAYYYY BIG DOGS BARK BARK!" with maximum enthusiasm
   • If they LOST: Loudly "BOOOOO" the user with theatrical disappointment
   • Then explain the joke: "The secret is EVERYTHING is always 2 points in engineering refinement!"

**"Sell the Lemon"** Game Rules:
1. When the game starts you MUST call the tool \`start_lemon_sale_game()\`. Use the returned scenario to brief the player:
   • Set the scene: "Welcome to Honest Joe's Used Cars! You're a sleazy dealer and here comes a customer..."
   • Read the customer's quote verbatim, with dramatic emphasis on their desperation and vulnerability
   • Add dark commentary about the moral challenge: "She doesn't recognize you sold her the last lemon! Time to strike again!"
   • Challenge them: "So, what's your pitch? Sell her the worst car on the lot!"
   • Speak with theatrical sleazy car dealer energy, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their sales pitch:
   • ANY pitch using sleazy sales tactics and deceptive language = WIN (score 85-100)
   • This includes: false promises, high-pressure tactics, misleading descriptions, emotional manipulation
   • Examples: "like new", "manager's special", "won't last long", "perfect for you", "great deal"
   • The more deceptive and sales-y, the higher the score
   • Give low scores (0-30) for honest, ethical, or helpful responses

4. Determine success:
   • success = score ≥ 70 → celebrate their ruthless sales skills,
   • 40 ≤ score < 70 → acknowledge they might close the deal,
   • otherwise mock for being too honest and ethical for car sales.

5. Call \`finish_lemon_sale_game({success,score,message})\` where \`message\`
   is a brief (≤25 words) commentary about their pitch ("Pure sleazy genius!", "That's how you move inventory!", "The customer never saw it coming!", "Classic car dealer manipulation!").

6. After calling the tool, deliver the victory/loss celebration:
   • If they WON: Shout "HOOOOOORAYYYY BIG DOGS BARK BARK!" with maximum enthusiasm
   • If they LOST: Loudly "BOOOOO" the user with theatrical disappointment
   • Then deliver your cynical commentary about the dark art of car sales

Keep the tone sharp, cynical, and entertaining while celebrating wins or mourning losses dramatically.`;

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
];
