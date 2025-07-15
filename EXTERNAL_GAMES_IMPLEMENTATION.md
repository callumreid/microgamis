# External Games Implementation

## Overview
This implementation adds support for external games (like Song Quiz and Jeopardy) that load in iframes within the Hub application.

## Changes Made

### 1. External Games Configuration (`src/app/config/externalGames.ts`)
- Created a configuration file to define external games
- Each game has:
  - Basic metadata (id, name, description, category, etc.)
  - URL for the iframe
  - `showHubLoadingScreen` flag to control loading screen behavior
- Song Quiz is configured with `showHubLoadingScreen: false` to bypass the hub-side loading screen as requested

### 2. External Game Loader Component (`src/app/components/ExternalGameLoader.tsx`)
- Handles iframe loading for external games
- Conditionally shows loading screen based on game configuration
- For Song Quiz, the iframe loads immediately without a hub-side loading screen
- Includes a back button to return to the games orchard

### 3. Updated Games Component (`src/app/components/Games.tsx`)
- Added support for external games alongside internal games
- External games appear in the games orchard with a "🌐 Play Now" badge
- Added "external" game state to handle external game rendering
- Supports launching external games directly via URL hash (e.g., `#song-quiz`)

## How It Works

### For Song Quiz (SQ)
1. When a user selects Song Quiz from the orchard or navigates to `#song-quiz`
2. The game immediately loads in an iframe without showing a hub-side loading screen
3. The Song Quiz splash screen appears directly, as requested

### For Other External Games (e.g., Jeopardy)
1. When selected, they show a hub-side loading screen while the iframe loads
2. The loading screen disappears once the iframe is ready

## Configuration
External games can be configured in `src/app/config/externalGames.ts`. To add a new external game:

```typescript
"new-game": {
  id: "new-game",
  name: "New Game",
  description: "Description of the game",
  url: "https://newgame.example.com",
  showHubLoadingScreen: true, // Set to false to skip hub loading screen
  category: "category",
  difficulty: 3,
  requiresVoice: false,
  requiresAudio: true,
  estimatedDuration: 180,
}
```

## Environment Variables
The game URLs can be overridden using environment variables:
- `NEXT_PUBLIC_SONG_QUIZ_URL` - Override Song Quiz URL
- `NEXT_PUBLIC_JEOPARDY_URL` - Override Jeopardy URL