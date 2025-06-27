# Games Orchard 🎮

Welcome to the Games Orchard - the home of all Microgamis micro games!

## Structure

Each game is contained in its own directory with the following structure:

```
game-name/
├── index.ts          # Main game logic and exports
├── GameComponent.tsx # React component for the game UI
├── types.ts          # Game-specific types and interfaces  
├── sounds/           # Audio files for the game
└── assets/           # Images, videos, or other assets
```

## Game Development Guidelines

### Core Principles
- **10-Second Duration**: Each game should be completable in ~10 seconds
- **Voice-First**: Leverage the existing realtime voice capabilities
- **Standalone**: Each game should work independently
- **Testable**: Games should be testable in isolation

### Game Interface
Each game must implement the `MicroGame` interface:

```typescript
interface MicroGame {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<GameProps>;
  initialize: () => void;
  cleanup: () => void;
  onVoiceInput: (transcript: string) => void;
  onGameEnd: (result: GameResult) => void;
}
```

### Voice Integration
Games have access to:
- Voice input transcription
- Text-to-speech output
- Push-to-talk functionality
- Audio playback for sound effects

### Game States
Standard game flow:
1. `initialize()` - Set up game state
2. Game loop - Handle voice input and update UI
3. `onGameEnd()` - Report results (win/lose/score)
4. `cleanup()` - Clean up resources

## Available Games

Current game stubs (ready for implementation):

### Social/Communication Games
- **make-up-an-excuse** - Convince your boss why you're late
- **convince-aliens-not-to-invade** - First contact diplomacy
- **pwn-the-bully** - Deliver the perfect comeback
- **advise-the-child** - Give helpful advice to a crying child
- **explain-death-to-daughter** - Handle delicate conversations
- **fire-the-employee** - Stay firm in difficult situations
- **stall-the-police** - Buy time with conversation
- **pitch-your-startup** - Convince investors

### Recognition/Identification Games  
- **what-sound-does-this-animal-make** - Make the right animal sound
- **name-that-capitol** - Identify world capitals
- **name-the-planet** - Identify planets
- **whos-that-pokemon** - Identify Pokemon
- **identify-the-criminal** - Pick the perpetrator
- **attract-the-turkey** - Make turkey sounds

### Decision/Strategy Games
- **point-the-engineering-task** - Estimate with Fibonacci scale
- **evaluate-yourself** - Performance review decisions
- **jump-off-bridge** - Peer pressure decisions (trick question)
- **aim-the-penalty-kick** - Soccer goal targeting
- **bet-on-roulette** - Gambling decisions
- **pick-the-not-poison** - Choose the safe option

### Action/Reaction Games
- **steer-the-ship** - Navigate away from icebergs
- **tell-the-captain-where-the-land-is** - Guide ships to safety
- **gone-fishing** - Timing-based fishing
- **volcano-casino** - Risk/reward proximity game
- **shatter-the-glass** - Pitch-based voice control

### Counting/Estimation Games
- **buffalo** - Count competing buffalo herds
- **how-many-cows** - Count stampeding cattle  
- **how-many-gumballs** - Estimate quantities

### Creative/Completion Games
- **finish-the-limerick** - Complete poetic verses
- **assemble-the-burger** - Order ingredients correctly
- **sell-the-car** - Sales conversation

## Testing Games

Individual games can be tested by:
1. Running the development server: `npm run dev`
2. Navigating to Games section
3. Using the test mode to select specific games
4. Or accessing directly via URL: `/games/test?game=game-id`

## Integration with Main App

Games integrate with the main application through:
- Shared voice session from realtime API
- Common UI components and styling
- Centralized game state management
- Audio system integration