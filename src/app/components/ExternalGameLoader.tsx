"use client";
import React, { useState, useEffect } from "react";
import { ExternalGameConfig } from "../config/externalGames";

interface ExternalGameLoaderProps {
  game: ExternalGameConfig;
  onBack?: () => void;
}

export default function ExternalGameLoader({ game, onBack }: ExternalGameLoaderProps) {
  const [isLoading, setIsLoading] = useState(game.showHubLoadingScreen);

  useEffect(() => {
    // For games that don't show hub loading screen, immediately show iframe
    if (!game.showHubLoadingScreen) {
      setIsLoading(false);
    }
  }, [game.showHubLoadingScreen]);

  const handleIframeLoad = () => {
    // Add a small delay before hiding loading screen for smoother transition
    if (game.showHubLoadingScreen) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading Screen - Only shown if showHubLoadingScreen is true */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-8">{game.name}</h2>
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
              <p className="text-xl text-white opacity-90">Loading game...</p>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-30 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium text-white transition-colors backdrop-blur-sm"
        >
          ← Back to Hub
        </button>
      )}

      {/* Game iframe - Always rendered but hidden until ready */}
      <iframe
        src={game.url}
        className={`w-full h-full border-0 ${
          !game.showHubLoadingScreen || (game.showHubLoadingScreen && !isLoading) 
            ? "block" 
            : "hidden"
        }`}
        onLoad={handleIframeLoad}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={game.name}
      />
    </div>
  );
}