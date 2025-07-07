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

## Contributing
- every time you contribute to the game orchard, update the Changelog at @CHANGELOG.md . note any changes made and provide any information useful for a future ai agent who is working in the code base
