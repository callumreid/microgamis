# Microgamis Changelog

## [Unreleased] - Initial Setup

### Added
- Project rebranded from OpenAI Realtime Agents to Microgamis
- This changelog to track all modifications for AI agent context
- Games navigation system with "Games" button in main UI header
- Games splash screen with "microgamis!" branding and "spin to play" button
- **NEW: "Visit the Orchard" button** - Direct access to browse all games in grid layout
- **NEW: Games Orchard View** - Comprehensive game browser with visual cards showing all 31 games
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

### Games User Experience Features
- **Two Play Modes**: Random spinner for surprise gameplay OR direct game selection via orchard view
- **Games Orchard Browser**: Visual grid layout displaying all 31 games with:
  - Game name, description, and category
  - Difficulty rating (1-5 stars)
  - Implementation status (Ready to Play vs Coming Soon)
  - Voice requirement indicators
  - Hover effects and responsive design
- **Seamless Navigation**: Easy transitions between splash screen, orchard view, and individual games
- Voice-based gameplay leveraging existing realtime capabilities

### Technical Notes for AI Agents
- Main entry point: `src/app/page.tsx`
- Component structure: `src/app/components/`
- Hooks for realtime session: `src/app/hooks/useRealtimeSession.ts`
- Agent configurations: `src/app/agentConfigs/`
- API routes: `src/app/api/`
- Audio utilities: `src/app/lib/audioUtils.ts`

## Instructions for Future AI Agents

When working on this codebase:

1. **Preserve Existing Functionality**: All original OpenAI Realtime Agent features should remain intact
2. **Games Integration**: Build alongside existing features, don't replace them
3. **Voice-First Design**: Leverage the existing realtime voice capabilities for game interactions
4. **Modular Structure**: Each game should be self-contained in the games-orchard directory
5. **10-Second Gameplay**: All games designed for quick 10-second play sessions
6. **Update This Changelog**: Document all significant changes for future context