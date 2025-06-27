# Microgamis Changelog

## [Unreleased] - Initial Setup

### Added
- Project rebranded from OpenAI Realtime Agents to Microgamis
- This changelog to track all modifications for AI agent context
- Games navigation system with "Games" button in main UI header
- Games splash screen with "microgamis!" branding and "spin to play" button
- Game spinner with visual rotation animation and random game selection
- Games orchard directory structure for modular game organization
- Base game framework with consistent UI, timer, and voice integration
- Game type system with metadata, categories, and difficulty ratings

### Games Architecture
- `games-orchard/` - Main directory for all micro games
- `BaseGame.tsx` - Reusable game wrapper with countdown, timer, scoring
- `types.ts` - TypeScript interfaces for games, results, and metadata  
- Game registry system for implemented vs planned games
- Individual game directories with `GameComponent.tsx` and `index.ts`

### Implemented Games (3/31)
1. **Point the Engineering Task** - Fibonacci scale estimation game
2. **What Sound Does This Animal Make?** - Voice-based animal sound matching
3. **BUFFALOOOO** - Buffalo counting and field comparison game

### Planned Games (28 remaining)
- Social/Communication: excuse making, alien diplomacy, bully comebacks, etc.
- Recognition/Identification: capitals, planets, Pokemon, criminal lineups
- Decision/Strategy: self-evaluation, bridge jumping, penalty kicks
- Action/Reaction: ship steering, fishing, volcano proximity, glass shattering
- Counting/Estimation: cow stampedes, gumball towers
- Creative/Completion: limericks, burger assembly, car sales pitches

### Architecture Overview
- Next.js 15.3.1 application with React 19
- OpenAI Realtime API integration (@openai/agents ^0.0.5)
- Tailwind CSS for styling
- TypeScript for type safety

### Original Features (Preserved)
- Real-time voice conversation with push-to-talk
- Agent configuration system with multiple agent types:
  - Chat Supervisor
  - Customer Service Retail
  - Simple Handoff
- Transcript management and session handling
- Audio utilities and codec handling
- Guardrails system for agent behavior

### Planned Microgamis Features
- Games navigation system
- Game spinner with random selection
- 30+ micro games (10-second duration each)
- Voice-based gameplay leveraging existing realtime capabilities
- Games orchard directory structure for modular game organization

### Technical Notes for AI Agents
- Main entry point: `src/app/page.tsx`
- Component structure: `src/app/components/`
- Hooks for realtime session: `src/app/hooks/useRealtimeSession.ts`
- Agent configurations: `src/app/agentConfigs/`
- API routes: `src/app/api/`
- Audio utilities: `src/app/lib/audioUtils.ts`

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## Instructions for Future AI Agents

When working on this codebase:

1. **Preserve Existing Functionality**: All original OpenAI Realtime Agent features should remain intact
2. **Games Integration**: Build alongside existing features, don't replace them
3. **Voice-First Design**: Leverage the existing realtime voice capabilities for game interactions
4. **Modular Structure**: Each game should be self-contained in the games-orchard directory
5. **10-Second Gameplay**: All games designed for quick 10-second play sessions
6. **Update This Changelog**: Document all significant changes for future context