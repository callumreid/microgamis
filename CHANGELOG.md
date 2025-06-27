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

### Implemented Games (31/31) - 🎉 COMPLETE! 
1. **Point the Engineering Task** - Fibonacci scale estimation game
2. **What Sound Does This Animal Make?** - Voice-based animal sound matching  
3. **BUFFALOOOO** - Buffalo counting and field comparison game
4. **Make Up an Excuse** - Convince your boss why you're late with AI evaluation
5. **Convince Aliens Not to Invade** - First contact diplomacy to save humanity
6. **Pwn the Bully** - Deliver perfect comebacks with wit evaluation
7. **Evaluate Yourself** - Corporate self-evaluation trick question game
8. **Steer the Ship** - Navigate Titanic away from icebergs with voice commands
9. **Gone Fishing** - Timing-based fishing with bobber movement detection
10. **Volcano Casino** - Risk/reward proximity game with voice stop commands
11. **Name That Capitol** - Geography recognition with country identification
12. **Name the Planet** - Solar system planet identification game
13. **Who's That Pokemon** - Pokemon silhouette recognition challenge
14. **Tell the Captain Where the Land Is** - Naval navigation with directional commands
15. **Advise the Child** - AI-judged parenting advice scenarios
16. **Jump Off Bridge?** - Satirical peer pressure game (always lose)
17. **Aim the Penalty Kick** - Soccer penalty kick vs smart goalkeeper
18. **Finish the Limerick** - Irish poetry completion with leprechaun character
19. **Identify the Criminal** - Crime scene witness lineup identification
20. **How Many Cows** - Cattle stampede counting challenge
21. **Attract the Turkey** - Turkey calling simulation with sound detection
22. **Explain Death to Daughter** - Sensitive conversation with AI empathy judging
23. **Fire the Employee** - Professional termination role-play
24. **Assemble the Burger** - Memory-based ingredient ordering game
25. **Stall the Police** - Time-based delay tactics with excuse evaluation
26. **Pitch Your Startup** - Entrepreneurial presentation with investor simulation
27. **Bet on Roulette** - Casino roulette betting with spinning wheel
28. **How Many Gumballs** - Gumball tower counting with camera pan effect
29. **Sell the Car** - Car dealership sales role-play with customer personas
30. **Pick the Not-Poison** - Magician's deadly choice psychological game
31. **Shatter the Glass** - High-pitch singing glass breaking challenge

### Game Categories Fully Implemented
- **Social/Communication (9 games)**: excuse making, alien diplomacy, bully comebacks, child advice, death explanation, employee firing, police stalling, startup pitching, car selling
- **Recognition/Identification (5 games)**: capitals, planets, Pokemon, criminal lineups, turkey calling
- **Decision/Strategy (4 games)**: self-evaluation, bridge jumping, penalty kicks, roulette betting, poison selection
- **Action/Reaction (6 games)**: ship steering, fishing, volcano proximity, glass shattering, navigation commands
- **Counting/Estimation (4 games)**: buffalo fields, cow stampedes, gumball towers
- **Creative/Completion (3 games)**: limericks, burger assembly

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