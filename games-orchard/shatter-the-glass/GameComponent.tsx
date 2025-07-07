"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function ShatterTheGlassGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [glassIntegrity, setGlassIntegrity] = useState(100);
  const [vibrationLevel, setVibrationLevel] = useState(0);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [shattered, setShattered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game once
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      updateMessage?.('Sing at high pitch to shatter the glass!');
      if (sendVoiceMessage) {
        sendVoiceMessage('Welcome to the glass-shattering challenge! You need to sing at exactly the right high pitch to make this wine glass vibrate until it shatters. Try singing high sustained notes like "EEEEEE" or "LAAAA"!');
      }
    }
  }, [isInitialized, updateMessage, sendVoiceMessage]);

  const handleShatterAttempt = () => {
    // Placeholder functionality - simulate a successful shatter
    setShattered(true);
    updateMessage?.('🎉 SHATTERED! Perfect pitch!');
    
    if (playSound) {
      playSound('glass-shatter');
    }
    
    if (sendVoiceMessage) {
      sendVoiceMessage('AMAZING! You hit the perfect resonant frequency and shattered the glass! Your vocal power is incredible!');
    }
    
    const score = 85; // Default score
    endGame?.(true, 'Glass shattered! Perfect resonant frequency!', score);
  };

  const getGlassStyle = () => {
    if (shattered) {
      return {
        background: 'linear-gradient(45deg, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 41%, rgba(255,255,255,0.1) 42%, transparent 43%, transparent 100%)',
        transform: 'scale(1.05)',
        filter: 'blur(2px)',
      };
    }
    
    const vibrationOffset = vibrationLevel > 50 ? Math.sin(Date.now() / 50) * (vibrationLevel / 20) : 0;
    
    return {
      transform: `translateX(${vibrationOffset}px) scale(${1 + vibrationLevel / 1000})`,
      filter: vibrationLevel > 30 ? `blur(${vibrationLevel / 100}px)` : 'none',
      background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)`,
      borderColor: vibrationLevel > 50 ? '#fbbf24' : '#e5e7eb',
      boxShadow: vibrationLevel > 30 ? `0 0 ${vibrationLevel/2}px rgba(255,255,255,0.5)` : 'none',
    };
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Wine glass */}
      <div className="relative">
        {/* Glass bowl */}
        <div 
          className="w-32 h-40 border-4 border-gray-300 rounded-b-full mx-auto transition-all duration-100"
          style={getGlassStyle()}
        >
          {/* Wine inside */}
          <div 
            className="absolute bottom-2 left-2 right-2 bg-red-800 rounded-b-full transition-all duration-300"
            style={{ 
              height: `${60 + vibrationLevel / 5}%`,
              transform: vibrationLevel > 20 ? `rotate(${Math.sin(Date.now() / 100) * (vibrationLevel / 10)}deg)` : 'none'
            }}
          ></div>
          
          {/* Glass reflections */}
          <div className="absolute top-4 left-4 w-8 h-16 bg-white opacity-20 rounded-full transform rotate-12"></div>
          <div className="absolute top-8 right-6 w-4 h-8 bg-white opacity-15 rounded-full"></div>
          
          {/* Shatter effect */}
          {shattered && (
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-8 bg-white opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `shatter-${i} 0.5s ease-out forwards`,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Vibration effects */}
          {vibrationLevel > 50 && !shattered && (
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-50"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    animation: `vibrate-${i % 3} 0.1s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Glass stem */}
        <div 
          className="w-2 h-16 bg-gray-300 mx-auto transition-transform duration-100"
          style={{ 
            transform: vibrationLevel > 30 ? `rotate(${Math.sin(Date.now() / 80) * (vibrationLevel / 30)}deg)` : 'none'
          }}
        ></div>
        
        {/* Glass base */}
        <div 
          className="w-20 h-4 bg-gray-300 rounded-full mx-auto transition-transform duration-100"
          style={{ 
            transform: vibrationLevel > 40 ? `translateY(${Math.sin(Date.now() / 60) * (vibrationLevel / 40)}px)` : 'none'
          }}
        ></div>
      </div>

      {/* Status displays */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded">
        <div className="text-sm font-bold mb-2">🎚️ Glass Status</div>
        <div className="text-xs mb-1">Integrity: {Math.round(glassIntegrity)}%</div>
        <div className="w-32 h-2 bg-gray-700 rounded mb-2">
          <div 
            className="h-full rounded transition-all duration-300"
            style={{ 
              width: `${glassIntegrity}%`,
              backgroundColor: glassIntegrity > 50 ? '#10b981' : glassIntegrity > 25 ? '#f59e0b' : '#ef4444'
            }}
          ></div>
        </div>
        <div className="text-xs mb-1">Vibration: {Math.round(vibrationLevel)}%</div>
        <div className="w-32 h-2 bg-gray-700 rounded">
          <div 
            className="h-full bg-purple-500 rounded transition-all duration-300"
            style={{ width: `${vibrationLevel}%` }}
          ></div>
        </div>
      </div>

      {/* Pitch meter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded">
        <div className="text-sm font-bold mb-2">🎵 Pitch Level</div>
        <div className="text-xs mb-1">Current: {Math.round(currentPitch)}</div>
        <div className="w-32 h-16 bg-gray-700 rounded relative">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded transition-all duration-300"
            style={{ height: `${Math.min(100, currentPitch * 1.5)}%` }}
          ></div>
          <div className="absolute top-1 left-1 right-1 text-xs text-red-400 font-bold">
            SHATTER
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!shattered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg text-center max-w-md">
          <p className="text-lg font-bold">🎤 Sing at high pitch!</p>
          <p className="text-sm">Try: "EEEEEE" or "LAAAAA" or sustained high notes</p>
          <p className="text-xs mt-2 opacity-75">
            Get the glass vibrating enough to shatter it!
          </p>
          <button 
            onClick={handleShatterAttempt}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
          >
            Shatter Glass (Placeholder)
          </button>
        </div>
      )}

      {/* Shatter celebration */}
      {shattered && (
        <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">💥</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              GLASS SHATTERED!
            </div>
            <div className="text-xl text-gray-200 mt-2">
              Perfect resonant frequency!
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes vibrate-0 { 0%, 100% { transform: translate(0); } 50% { transform: translate(1px, -1px); } }
        @keyframes vibrate-1 { 0%, 100% { transform: translate(0); } 50% { transform: translate(-1px, 1px); } }
        @keyframes vibrate-2 { 0%, 100% { transform: translate(0); } 50% { transform: translate(1px, 1px); } }
      `}</style>
    </div>
  );
}

export default function ShatterTheGlassGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Shatter The Glass"
      instructions="Sing at high pitch to make the glass vibrate until it shatters!"
      duration={15}
      {...props}
    >
      <ShatterTheGlassGame />
    </BaseGame>
  );
}