"use client";
import React, { useState } from "react";
import { allPlannedGames, getGameById, isGameImplemented } from "../../../games-orchard";
import { GameMetadata } from "../../../games-orchard/types";

export default function Games() {
  const [gameState, setGameState] = useState<"splash" | "spinning" | "playing" | "orchard">("splash");
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [GameComponent, setGameComponent] = useState<React.ComponentType<any> | null>(null);
  const [spinRotation, setSpinRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinToPlay = () => {
    setGameState("spinning");
    setIsSpinning(true);
    
    // Simulate spinning for 3 seconds
    const spinDuration = 3000;
    const finalRotation = 360 * 5 + Math.random() * 360; // 5 full rotations plus random
    
    setSpinRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      // Select random game from all planned games
      const randomGame = allPlannedGames[Math.floor(Math.random() * allPlannedGames.length)];
      setSelectedGame(randomGame);
      
      // Load component if implemented
      if (isGameImplemented(randomGame.id)) {
        const component = getGameById(randomGame.id);
        setGameComponent(() => component);
      } else {
        setGameComponent(null);
      }
      
      setGameState("playing");
    }, spinDuration);
  };

  const handleBackToSplash = () => {
    setGameState("splash");
    setSelectedGame(null);
    setGameComponent(null);
    setSpinRotation(0);
  };

  const handleVisitOrchard = () => {
    setGameState("orchard");
  };

  const handleSelectGameFromOrchard = (game: GameMetadata) => {
    setSelectedGame(game);
    
    // Load component if implemented
    if (isGameImplemented(game.id)) {
      const component = getGameById(game.id);
      setGameComponent(() => component);
    } else {
      setGameComponent(null);
    }
    
    setGameState("playing");
  };

  const handleGameEnd = () => {
    // Show result briefly then return to splash
    setTimeout(() => {
      handleBackToSplash();
    }, 3000);
  };

  const renderSplashScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <h1 className="text-8xl font-bold mb-12 text-center">
        microgamis!
      </h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSpinToPlay}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-2xl transition-colors transform hover:scale-105"
        >
          spin to play
        </button>
        <button
          onClick={handleVisitOrchard}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-2xl transition-colors transform hover:scale-105"
        >
          visit the orchard
        </button>
      </div>
    </div>
  );

  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-600 to-teal-600 text-white">
      <h2 className="text-4xl font-bold mb-8">Spinning...</h2>
      <div className="relative">
        <div 
          className="w-80 h-80 border-8 border-white rounded-full flex items-center justify-center"
          style={{
            transform: `rotate(${spinRotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          <div className="text-lg font-bold text-center">
            Game<br />Spinner
          </div>
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500"></div>
        </div>
      </div>
      {isSpinning && (
        <div className="mt-8 text-xl">
          🎵 *gameshow music intensifies* 🎵
        </div>
      )}
    </div>
  );

  const renderOrchard = () => (
    <div className="h-full bg-gradient-to-br from-orange-600 to-amber-600 text-white p-8 overflow-y-auto">
      <button
        onClick={handleBackToSplash}
        className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors z-10"
      >
        ← Back to Games
      </button>
      
      <div className="text-center mb-8 pt-16">
        <h1 className="text-6xl font-bold mb-4">🌳 The Orchard 🌳</h1>
        <p className="text-xl opacity-90">Choose your microgame adventure!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {allPlannedGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleSelectGameFromOrchard(game)}
            className={`bg-white bg-opacity-20 rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 hover:bg-opacity-30 ${
              isGameImplemented(game.id) ? 'border-2 border-green-400' : 'border-2 border-gray-400 opacity-75'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{game.name}</h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-3">{game.description}</p>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="font-medium">{'★'.repeat(game.difficulty)}{'☆'.repeat(5-game.difficulty)}</span>
                </div>
                {game.requiresVoice && (
                  <div className="text-yellow-300 font-medium">🎤 Voice Required</div>
                )}
              </div>
              
              <div className="mt-4">
                {isGameImplemented(game.id) ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ✓ Ready to Play
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGamePlay = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-600 to-pink-600 text-white p-8">
      <button
        onClick={handleBackToSplash}
        className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        ← Back to Games
      </button>
      
      {selectedGame && (
        <div className="w-full h-full">
          {GameComponent ? (
            <GameComponent onGameEnd={handleGameEnd} />
          ) : (
            <div className="text-center max-w-2xl mx-auto flex flex-col justify-center h-full">
              <h2 className="text-5xl font-bold mb-4">{selectedGame.name}</h2>
              <p className="text-xl mb-8">{selectedGame.description}</p>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4">Game Coming Soon!</h3>
                <p className="text-lg">
                  This game is currently under development. Each game will be a 10-second 
                  voice-interactive experience using the realtime AI capabilities.
                </p>
                <p className="text-sm mt-4 opacity-75">
                  Category: {selectedGame.category} | Difficulty: {selectedGame.difficulty}/5
                  {selectedGame.requiresVoice && ' | Voice Required'}
                </p>
              </div>
              
              <button
                onClick={handleBackToSplash}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold text-xl transition-colors"
              >
                Play Another Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen">
      {gameState === "splash" && renderSplashScreen()}
      {gameState === "spinning" && renderSpinner()}
      {gameState === "orchard" && renderOrchard()}
      {gameState === "playing" && renderGamePlay()}
    </div>
  );
}