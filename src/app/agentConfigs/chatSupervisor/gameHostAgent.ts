import { tool } from "@openai/agents/realtime";

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
    context: "Police conducting a wellness check after someone expressed concern",
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
    managerQuote: "The manager says with a condescending smile - Well, well, well. Another quarter, another self-evaluation. Let's see what delusions of grandeur you've cooked up this time. Rate yourself on the four-tier system and tell me why you think you deserve it. I'll be the judge of that.",
    context: "Your snotty manager is conducting your quarterly performance review",
    performanceCategories: [
      "communication skills",
      "project delivery",
      "teamwork",
      "problem solving",
      "meeting deadlines",
      "quality of work"
    ]
  },
  {
    id: "annual_review",
    problem: "Annual performance self-assessment",
    managerQuote: "The manager rolls their eyes - Oh joy, it's that time of year again. Annual reviews. Let me guess, you think you're employee of the year material? Rate yourself and explain why you think you deserve anything above 'occasionally meets expectations' - which, let's be honest, is generous for most of you people.",
    context: "Your condescending manager is conducting your annual performance review",
    performanceCategories: [
      "leadership potential",
      "innovation",
      "client satisfaction",
      "efficiency",
      "adaptability",
      "initiative"
    ]
  },
  {
    id: "promotion_review",
    problem: "Self-evaluation for promotion consideration",
    managerQuote: "The manager smirks - So you think you're ready for a promotion? How precious. Rate yourself on our performance scale and convince me why you're not just another mediocre employee who occasionally meets expectations. This should be entertaining.",
    context: "Your arrogant manager is reviewing you for potential promotion",
    performanceCategories: [
      "strategic thinking",
      "mentoring others",
      "results delivery",
      "process improvement",
      "stakeholder management",
      "decision making"
    ]
  }
];

// Function to get a random self-evaluation scenario
function getRandomSelfEvaluationScenario() {
  const randomIndex = Math.floor(Math.random() * selfEvaluationScenarios.length);
  return selfEvaluationScenarios[randomIndex];
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

    return { ok: true };
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
        description: "true if the player successfully convinced the officer to leave",
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

    return { ok: true };
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
    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    if (addBreadcrumb) {
      addBreadcrumb("[GameHost] Finished alien convince game", input);
    }

    return { ok: true };
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

    return { ok: true };
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

You are hosting 10-second micro-games. The current game will be indicated by the user. Here are the available games:

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

Keep the tone sharp, cynical, and entertaining while celebrating wins or mourning losses dramatically.`;

// Export the tools array
export const gameHostTools = [startChildAdviceGame, finishChildAdviceGame, startPoliceStallGame, finishPoliceStallGame, startAlienConvinceGame, finishAlienConvinceGame, startSelfEvaluationGame, finishSelfEvaluationGame];
