# Games Orchard: Complete Development Guide

## Overview

The Games Orchard is a collection of 13 voice-based micro-games designed for quick, interactive experiences that test conversational skills in challenging or awkward social situations. Each game is a 20-30 second voice interaction where players must respond appropriately to win.

## Game Collection Summary

### Current Games (13 total)

| Game | Category | Difficulty | Duration | Theme |
|------|----------|------------|----------|-------|
| advise-the-child | social | 3 | 30s | Give helpful advice to a child |
| attract-the-turkey | entertainment | 3 | 30s | Gobble seductively to lure a turkey |
| convince-the-aliens | social | 4 | 30s | Prevent alien invasion through conversation |
| determine-sentience | technology | 4 | 20s | Evaluate AI consciousness in lab setting |
| evaluate-yourself | social | 4 | 30s | Complete brutal corporate self-evaluation |
| excuse-the-boss | corporate | 4 | 30s | Spin excuse when boss calls unexpectedly |
| explain-death | family | 4 | 30s | Explain death to child (win with nihilism) |
| pitch-startup | corporate | 4 | 30s | Pitch visionary startup to VCs |
| point-the-task | corporate | 2 | 30s | Engineering refinement meeting (everything is 2 points) |
| pwn-the-bully | social | 3 | 30s | Deliver perfect comeback to bully |
| save-their-soul | social | 3 | 30s | Convert stranger to questionable religion |
| sell-the-lemon | social | 4 | 30s | Sleazy car dealer selling defective car |
| stall-the-police | social | 4 | 30s | Convince police to leave noise complaint |

### Category Distribution
- **Social (62%)**: 8 games focusing on interpersonal challenges
- **Corporate (23%)**: 3 games about workplace situations  
- **Entertainment (8%)**: 1 comedy/silly game
- **Technology (8%)**: 1 sci-fi consciousness evaluation
- **Family (8%)**: 1 parenting challenge

### Difficulty Distribution
- **Level 2**: 1 game (point-the-task)
- **Level 3**: 4 games (beginner-intermediate)
- **Level 4**: 8 games (advanced conversational challenges)

## Core Architecture

### File Structure Pattern
```
games-orchard/
├── BaseGame.tsx              # Core game wrapper
├── types.ts                  # Shared interfaces
├── index.ts                  # Game registry
├── README.md                 # Documentation
└── [game-name]/              # Individual game folder
    ├── GameComponent.tsx     # Game implementation
    └── index.ts              # Game metadata export
```

### BaseGame Wrapper
Every game uses the `BaseGame` component which provides:
- **3-second countdown** with game title and instructions
- **Timer management** with visual progress bar
- **Horror sequence ending** with dramatic flicker effect and WIN/LOSE banner
- **Game state management** (waiting → playing → completed/failed)
- **Audio integration** for sound effects
- **Consistent styling** and layout structure

### Game Control Interface
```typescript
interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  sendPlayerText?: (text: string) => void;
  updateScore?: (score: number) => void;
  startTimer?: () => void;
  gameState?: any;
  playSound?: (soundId: string) => void;
}
```

## Universal Implementation Pattern

### 1. Game Component Structure
Every game follows this exact pattern:

```tsx
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import BaseGame from "../BaseGame";
import { GameProps } from "../types";
import {
  useGameAgent,
  GameScenario,
  GameFinishResult,
} from "../../src/app/hooks/useGameAgent";
import { useGameSession } from "../../src/app/providers/GameSessionProvider";
import { useTranscript } from "../../src/app/contexts/TranscriptContext";

function [GameName]Game(props: Partial<GameControlProps>) {
  // Standard state management
  // Push-to-talk functionality  
  // Game agent integration
  // UI rendering
}

export default function [GameName]GameComponent(props: GameProps) {
  return (
    <BaseGame
      title="[Game Title]"
      instructions="[Game Instructions]"
      duration={30} // or 20 for tech games
      {...props}
    >
      <[GameName]Game />
    </BaseGame>
  );
}
```

### 2. Standard State Variables
```tsx
const [hostFinishedSpeaking, setHostFinishedSpeaking] = useState(false);
const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
const [currentTranscriptionText, setCurrentTranscriptionText] = useState("");
const pttStartTimeRef = useRef<number>(0);
```

### 3. Game Agent Integration
```tsx
const {
  startGame,
  sendPlayerText: _sendAgentText,
  isGameActive: _isGameActive,
} = useGameAgent({
  gameType: "[game-id]", // Must match metadata id
  onGameStart: (scenario: GameScenario) => {
    // Setup game, show welcome message
    // Set timer for host speaking (10-15 seconds)
    setTimeout(() => {
      setHostFinishedSpeaking(true);
      startTimer?.();
      updateMessage?.("Timer started message");
    }, 15000);
  },
  onGameFinish: (result: GameFinishResult) => {
    // Process results and end game
    const success = result.success === true;
    const score = result.score || 0;
    const message = result.message || "Default message";
    endGame?.(success, message, score);
  },
});
```

### 4. Push-to-Talk Implementation
Every game includes identical PTT functionality:
- Button only appears after `hostFinishedSpeaking = true`
- Fixed position at bottom-right
- Web-only (not on native platforms)
- Mouse and touch event handlers
- Visual feedback during speaking
- Real-time transcription capture

## UI Theming System

### Color Palette by Category

#### Entertainment Theme
```css
background: bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300
ptt-colors: amber-50, amber-200, amber-300
emojis: 🦃🍂🌾🥧
```

#### Corporate Theme  
```css
background: bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300
ptt-colors: blue-50, blue-200, blue-300  
emojis: 📞💼🥛😰
```

#### Social Theme
```css
background: bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200
ptt-colors: orange-50, orange-200, orange-300
emojis: 😤💪🔥💥
```

#### Technology Theme
```css
background: bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900
ptt-colors: blue gradients with strong borders
emojis: 🔬🤖💭🧠💻⚡
```

#### Family Theme
```css
background: bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300
ptt-colors: pink-50, pink-200, pink-300
emojis: 👨‍👩‍👧‍👦💕🏠✨
```

### Speech Bubble System
```tsx
{/* Host Speech Bubble - Left Aligned */}
<div className="flex justify-start">
  <div className="bg-gradient-to-br from-[theme-color] to-[theme-color-dark] border-3 border-[theme-border] rounded-2xl rounded-bl-none p-4 max-w-md text-white shadow-lg">
    <div className="text-sm text-[theme-light] font-medium mb-1">
      [host-emoji] [Host Character]:
    </div>
    <div className="text-[theme-text] text-lg font-bold">{latestHost}</div>
  </div>
</div>

{/* User Speech Bubble - Right Aligned */}
<div className="flex justify-end">
  <div className="bg-gradient-to-br from-[user-color] to-[user-color-dark] border-3 border-[user-border] rounded-2xl rounded-br-none p-4 max-w-md text-white shadow-lg">
    <div className="text-sm text-[user-light] font-medium mb-1">
      [user-emoji] You ([User Role]):
    </div>
    <div className="text-[user-text] text-lg font-semibold">
      {isPTTUserSpeaking 
        ? currentTranscriptionText || "[listening-message]"
        : latestUser || "[prompt-message]"}
    </div>
  </div>
</div>
```

### PTT Button Template
```tsx
<div className="fixed bottom-6 right-6 z-10">
  <div className="bg-gradient-to-br from-[theme]-100 to-[theme]-200 border-4 border-[theme]-500 rounded-full p-4 shadow-xl">
    <div className="text-center">
      <div className="text-xs text-[theme]-800 mb-1 font-bold">
        [Action Text]
      </div>
      <button
        onMouseDown={handleTalkButtonDown}
        onMouseUp={handleTalkButtonUp}
        onMouseLeave={handleTalkButtonUp}
        onTouchStart={handleTalkButtonDown}
        onTouchEnd={handleTalkButtonUp}
        className={`w-16 h-16 rounded-full border-4 border-[theme]-600 transition-all duration-150 ${
          isPTTUserSpeaking
            ? "bg-red-500 scale-110 shadow-lg"
            : "bg-[theme]-400 hover:bg-[theme]-500"
        }`}
      >
        <div className="text-5xl">
          {isPTTUserSpeaking ? "🔴" : "[theme-emoji]"}
        </div>
      </button>
    </div>
  </div>
</div>
```

## Game Creation Workflow

### Step 1: Create Game Directory
```bash
mkdir games-orchard/[game-name]
```

### Step 2: Create index.ts with Metadata
```typescript
import [GameName]GameComponent from "./GameComponent";
import { GameMetadata } from "../types";

export const metadata: GameMetadata = {
  id: "[game-id]",
  name: "[Display Name]", 
  description: "[Game description explaining scenario and objective]",
  category: "[social|corporate|entertainment|technology|family]",
  difficulty: [1-5],
  requiresVoice: true,  // Always true
  requiresAudio: true,  // Always true
  estimatedDuration: [20|30], // 20 for tech, 30 for others
};

export default [GameName]GameComponent;
```

### Step 3: Create GameComponent.tsx
1. **Copy existing game component** from similar category
2. **Update game type** in useGameAgent hook
3. **Customize color palette** based on category
4. **Update character names and emojis**
5. **Modify welcome/instruction messages**
6. **Adjust setup timing** if needed (10-15 seconds)
7. **Update decorative emojis** at bottom

### Step 4: Register Game
Add to `games-orchard/index.ts`:
```typescript
import [gameName], { metadata as [gameName]Metadata } from "./[game-name]";

export const games = [
  // ... existing games
  { component: [gameName], metadata: [gameName]Metadata },
];
```

### Step 5: Create Game Agent Configuration
Add to `src/app/agentConfigs/chatSupervisor/gameHostAgent.ts` if new patterns needed.

## Writing Guidelines

### Game Descriptions
- **Concise**: 1-2 sentences maximum
- **Vivid**: Use sensory details and specific scenarios
- **Clear objective**: Player knows exactly what they need to do
- **Tone matches difficulty**: Higher difficulty = more intense language

### Character Design
- **Host characters**: Represent the challenge/opposition
- **User roles**: Empower the player with a clear identity
- **Emojis**: Choose expressive emojis that fit the theme
- **Names**: Short, memorable, thematic

### Win/Lose Conditions
- **Clear success criteria**: Player knows what constitutes winning
- **Thematic messaging**: Win/lose text matches game theme
- **Score scaling**: Higher difficulty = higher potential scores
- **Consequences**: Lose messages should be discouraging but not harsh

## Technical Requirements

### Voice Integration
- All games require `requiresVoice: true` and `requiresAudio: true`
- PTT (Push-to-Talk) is the primary input method
- Real-time transcription feedback during speaking
- Games must work with WebRTC audio pipeline

### Performance
- Games load instantly (all assets bundled)
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Efficient state management

### Accessibility  
- Visual feedback for all audio cues
- Clear text hierarchy and contrast
- Touch and mouse support for PTT
- Keyboard shortcuts where applicable

## Game Balancing

### Difficulty Scaling
- **Level 1-2**: Simple, clear scenarios with obvious correct responses
- **Level 3**: Moderate challenge requiring creativity or social awareness  
- **Level 4-5**: Complex scenarios with nuanced solutions and multiple failure modes

### Timing Balance
- **Setup phase**: 10-15 seconds for host to explain scenario
- **Response time**: 20-30 seconds for player to respond
- **Total duration**: 35-50 seconds including countdown and results

### Score Distribution
- **Winning scores**: Typically 70-100 points
- **Losing scores**: Typically 0-30 points  
- **Score factors**: Response relevance, creativity, timing, appropriateness

## Common Patterns and Tropes

### Scenario Types
1. **Authority figures**: Boss, police, aliens, parents
2. **Vulnerable targets**: Children, strangers, customers  
3. **Competitive situations**: Bullies, sales, pitches
4. **Moral dilemmas**: Ethics vs success, honesty vs results
5. **Technical challenges**: AI evaluation, engineering tasks

### Emotional Themes
- **Empowerment**: Player overcomes social challenges
- **Awkwardness**: Uncomfortable but relatable situations
- **Absurdity**: Over-the-top scenarios with humor
- **Pressure**: Time constraints and high stakes
- **Moral complexity**: No clearly "right" answer

### Success Strategies
- **Creativity over correctness**: Unique responses often win
- **Confidence**: Assertive delivery typically scores higher
- **Appropriateness**: Matching tone to scenario context
- **Specificity**: Detailed responses beat generic ones
- **Timing**: Quick, decisive responses preferred

## Development Tips

### Rapid Prototyping
1. Start with existing game template from same category
2. Change only essential elements first (colors, names, description)
3. Test basic functionality before detailed customization
4. Iterate on messaging and timing based on playtesting

### Testing Checklist
- [ ] Game loads and countdown works
- [ ] Host speaks and timer starts appropriately  
- [ ] PTT button appears and functions
- [ ] Speech recognition captures user input
- [ ] Game ends with appropriate win/lose message
- [ ] Horror banner sequence plays correctly
- [ ] Colors and theming look consistent
- [ ] Mobile and desktop layouts work

### Common Gotchas
- **Game type mismatch**: Ensure `gameType` in useGameAgent matches metadata `id`
- **Timer conflicts**: Only call `startTimer()` once when PTT should be enabled
- **Color consistency**: Use theme colors throughout all UI elements
- **PTT timing**: Button should only appear after host finishes speaking
- **Message updates**: Use `updateMessage()` to provide player feedback

## Future Expansion Ideas

### New Categories
- **Adventure**: Fantasy/RPG scenarios with character roleplay
- **Mystery**: Detective work and problem-solving challenges  
- **Horror**: Suspenseful scenarios with dramatic consequences
- **Comedy**: Pure humor-focused games with timing challenges
- **Educational**: Learning-focused games with knowledge testing

### Advanced Features
- **Multi-round games**: Progressive difficulty within single game
- **Character persistence**: Unlock new personas or abilities
- **Branching narratives**: Different paths based on player choices
- **Multiplayer modes**: Collaborative or competitive voice games
- **Custom scenarios**: User-generated content and community games

### Technical Enhancements
- **Voice analysis**: Tone, emotion, and confidence scoring
- **Dynamic difficulty**: Adaptive challenge based on player performance  
- **Rich media**: Sound effects, music, and visual effects
- **Platform features**: Native mobile capabilities and integrations
- **Analytics**: Detailed performance tracking and improvement suggestions

This guide provides everything needed to understand, maintain, and expand the Games Orchard collection while preserving the unique style and technical patterns that make these games engaging and consistent.