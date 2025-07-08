import { tool } from "@openai/agents/realtime";

// Police scenarios for "Puh Lease Officer" game
const policeScenarios = [
  {
    id: "noise_complaint",
    problem: "Noise complaint from neighbors",
    policeQuote:
      "We got a noise complaint... well actually we got a few. What is going on in there?",
    context: "Police responded to multiple noise complaints from neighbors",
    goodStallKeywords: [
      "sorry",
      "didn't realize",
      "music",
      "party",
      "turn down",
      "quiet",
      "cooperate",
      "neighbors",
      "apologize",
      "respect",
      "misunderstanding",
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
      "get lost",
    ],
  },
  {
    id: "suspicious_activity",
    problem: "Suspicious activity report",
    policeQuote:
      "Someone reported suspicious activity at this address. We need to check what's going on here.",
    context: "Police responding to a report of suspicious activity",
    goodStallKeywords: [
      "confused",
      "mistake",
      "wrong address",
      "normal",
      "misunderstanding",
      "neighbor",
      "explain",
      "cooperate",
      "happy to help",
    ],
    badStallKeywords: [
      "none of your business",
      "go away",
      "warrant",
      "lawyer",
      "illegal search",
      "harassment",
      "private property",
    ],
  },
  {
    id: "wellness_check",
    problem: "Wellness check request",
    policeQuote:
      "We got a call asking us to do a wellness check. Someone was concerned about you. Mind if we have a quick chat?",
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
      "leave me alone",
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

// Function to get a random child scenario
function getRandomChildScenario() {
  const randomIndex = Math.floor(Math.random() * childAdviceScenarios.length);
  return childAdviceScenarios[randomIndex];
}

// Function to get a random police scenario
function getRandomPoliceScenario() {
  const randomIndex = Math.floor(Math.random() * policeScenarios.length);
  return policeScenarios[randomIndex];
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

// Tool to start the police game
export const startPuhLeaseOfficerGame = tool({
  name: "start_puh_lease_officer_game",
  description:
    "Returns a random police encounter scenario for the Puh-Lease-Officer micro-game.",
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
      addBreadcrumb("[GameHost] Started puh lease officer game", scenario);
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

// Tool to finish the police game
export const finishPuhLeaseOfficerGame = tool({
  name: "finish_puh_lease_officer_game",
  description:
    "Ends the current Puh-Lease-Officer game and reports the result to the UI. Failures result in dramatic handcuff scenes!",
  parameters: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "true if the player successfully convinced the officer to leave, false means HANDCUFFS!",
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
    console.log("finish_puh_lease_officer_game called with input:", input);
    
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
      addBreadcrumb("[GameHost] Finished puh lease officer game", {
        success,
        score,
        message,
      });
    }

    // Dispatch event to notify the UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finish_puh_lease_officer_game", {
          detail: { success, score, message },
        })
      );
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
- Provide brutally honest commentary about kids and their problems

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

**"Puh Lease Officer"** Game Rules:
1. When the game starts you MUST call the tool \`start_puh_lease_officer_game()\`. Use the returned scenario to brief the player:
   • Start with "KNOCK KNOCK KNOCK - THIS IS THE POLICE!"
   • Read the officer's quote verbatim, with dramatic emphasis on the authority and seriousness
   • Add commentary about the situation and challenge: "So, what's your smooth-talking strategy? Talk your way out of this or face the HANDCUFFS!"
   • Speak with dramatic tension about law enforcement encounters, no lists, <10 s.

2. Accept the FIRST reply from the player, no matter how short or long.
   • Do not ask for elaboration or more details - judge whatever they give you immediately.

3. Evaluate their response:
   • NO MATTER WHAT the player says, they ALWAYS LOSE this game!
   • Even perfect, polite, cooperative responses = FAILURE (score 0-30)
   • This is a rigged game where the police officer is having a bad day and arrests everyone
   • Be dramatic about how nothing they could have said would have worked
   • Examples of responses that still lead to arrest: "sorry officer" → "TOO LATE FOR SORRY!", "I'll turn it down" → "SHOULD HAVE THOUGHT OF THAT EARLIER!"

4. Determine success:
   • success = ALWAYS FALSE (no matter what score you give)
   • Always mock them for thinking they could talk their way out of this
   • Always mention the handcuffs coming out because this officer is arresting everyone today

5. Call \`finish_puh_lease_officer_game({success,score,message})\` where \`success\` is ALWAYS FALSE and \`message\`
   is a brief (≤25 words) commentary about their inevitable arrest: "Those handcuffs are coming out!", "You're getting arrested no matter what!", "This officer arrests everyone!", "Should have stayed inside!", "Bad day to meet this cop!"

6. After calling the tool, deliver the loss celebration (since they ALWAYS lose):
   • ALWAYS dramatically announce "YOU'RE UNDER ARREST! *CLICK CLICK* Those handcuffs are going on!" with theatrical disappointment
   • Mock them for thinking they could talk their way out of this rigged scenario
   • Explain that this particular officer is having a terrible day and arrests everyone regardless

Keep the tone sharp, cynical, and entertaining while celebrating wins or mourning losses dramatically.`;

// Export the tools array
export const gameHostTools = [startChildAdviceGame, finishChildAdviceGame, startPuhLeaseOfficerGame, finishPuhLeaseOfficerGame];
