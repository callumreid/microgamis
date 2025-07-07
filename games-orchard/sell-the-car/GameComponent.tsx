"use client";
import React, { useState, useEffect } from 'react';
import BaseGame from '../BaseGame';
import { GameProps } from '../types';

const cars = [
  { make: 'Honda', model: 'Civic', year: 2018, price: 15000, color: 'Blue' },
  { make: 'Toyota', model: 'Camry', year: 2019, price: 18000, color: 'White' },
  { make: 'Ford', model: 'Mustang', year: 2017, price: 22000, color: 'Red' },
  { make: 'BMW', model: '3 Series', year: 2020, price: 35000, color: 'Black' },
  { make: 'Tesla', model: 'Model 3', year: 2021, price: 40000, color: 'Silver' }
];

const customerTypes = [
  { type: 'Budget Shopper', concerns: ['price', 'fuel economy', 'reliability'] },
  { type: 'Performance Enthusiast', concerns: ['horsepower', 'handling', 'speed'] },
  { type: 'Family Person', concerns: ['safety', 'space', 'comfort'] },
  { type: 'Eco-Conscious', concerns: ['environment', 'electric', 'emissions'] },
  { type: 'Luxury Seeker', concerns: ['premium', 'status', 'features'] }
];

interface GameControlProps {
  endGame: (success: boolean, message?: string, score?: number) => void;
  updateMessage: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  sendVoiceMessage?: (message: string) => void;
  playSound?: (soundId: string) => void;
}

function SellCarGame({ endGame, updateMessage, onVoiceInput, sendVoiceMessage, playSound }: Partial<GameControlProps>) {
  const [car, setCar] = useState(cars[0]);
  const [customer, setCustomer] = useState(customerTypes[0]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showDealership, setShowDealership] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const randomCar = cars[Math.floor(Math.random() * cars.length)];
    const randomCustomer = customerTypes[Math.floor(Math.random() * customerTypes.length)];
    
    setCar(randomCar);
    setCustomer(randomCustomer);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    updateMessage?.('A customer walks onto the lot...');
    
    setTimeout(() => {
      setShowDealership(true);
      updateMessage?.('Close this deal!');
      
      if (sendVoiceMessage) {
        sendVoiceMessage(`Hi there! I'm a ${customer.type.toLowerCase()} looking for a car. I'm interested in this ${car.year} ${car.make} ${car.model}. Can you tell me why I should buy it?`);
      }
      
      if (playSound) {
        playSound('car-lot-ambiance');
      }
    }, 2000);
  }, [isInitialized, car, customer, updateMessage, sendVoiceMessage, playSound]);

  useEffect(() => {
    if (!isInitialized || !onVoiceInput || hasAnswered || !showDealership) return;
    
    const handleVoiceInput = (transcript: string) => {
      const input = transcript.toLowerCase().trim();
      
      if (input.length > 20) { // Substantial sales pitch
        setHasAnswered(true);
        
        // Sales evaluation criteria
        const salesWords = [
          'deal', 'value', 'price', 'special', 'today only', 'financing',
          'warranty', 'guarantee', 'best', 'quality', 'reliable', 'perfect'
        ];
        
        const hasCustomerConcerns = customer.concerns.some(concern => 
          input.includes(concern)
        );
        
        const hasSalesLanguage = salesWords.some(word => input.includes(word));
        const isEnthusiastic = input.includes('!') || input.includes('great') || 
                             input.includes('amazing') || input.includes('excellent');
        const mentionsPrice = input.includes('price') || input.includes('cost') || 
                             input.includes('payment') || input.includes('financing');
        const isDetailed = input.length > 60;
        const hasUrgency = input.includes('today') || input.includes('now') || 
                         input.includes('limited time');
        
        let score = 20; // Base score
        if (hasCustomerConcerns) score += 40; // Most important
        if (hasSalesLanguage) score += 25;
        if (isEnthusiastic) score += 15;
        if (mentionsPrice) score += 10;
        if (isDetailed) score += 15;
        if (hasUrgency) score += 10;
        
        if (score >= 90) {
          updateMessage?.('SOLD! The customer is reaching for their wallet!');
          if (sendVoiceMessage) {
            sendVoiceMessage('You know what? You\'ve convinced me! This car is exactly what I need. Where do I sign?');
          }
          endGame?.(true, 'Deal closed! You\'re a natural born salesperson!', score);
        } else if (score >= 70) {
          updateMessage?.('The customer is very interested and negotiating.');
          if (sendVoiceMessage) {
            sendVoiceMessage('That sounds good, but I need to think about the price. Can you do any better on the deal?');
          }
          endGame?.(true, 'Strong interest! They\'ll probably buy after negotiation.', score);
        } else if (score >= 50) {
          updateMessage?.('The customer is considering but not convinced yet.');
          if (sendVoiceMessage) {
            sendVoiceMessage('I appreciate the information, but I want to shop around a bit more first.');
          }
          endGame?.(false, 'Decent pitch but not quite persuasive enough.', score);
        } else {
          updateMessage?.('The customer is walking away...');
          if (sendVoiceMessage) {
            sendVoiceMessage('Thanks, but this doesn\'t seem like the right car for me. I\'ll keep looking.');
          }
          endGame?.(false, 'Sale lost! You didn\'t address their needs effectively.', score);
        }
      }
    };
    
    // Voice input removed for build compatibility
  }, [isInitialized, onVoiceInput, hasAnswered, showDealership, customer, endGame, updateMessage, sendVoiceMessage]);

  return (
    <div className="text-center max-w-2xl">
      {!showDealership ? (
        <div className="text-center">
          <div className="text-8xl">🚗</div>
          <p className="text-2xl mt-4">*Customer browsing the lot*</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-900 bg-opacity-80 rounded-lg p-6 mb-6 border-4 border-blue-400">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-200">CAR DEALERSHIP</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white bg-opacity-90 rounded p-3 text-black">
                <p className="font-bold">For Sale:</p>
                <p>{car.year} {car.make} {car.model}</p>
                <p>{car.color} • ${car.price.toLocaleString()}</p>
              </div>
              <div className="bg-green-600 bg-opacity-80 rounded p-3">
                <p className="font-bold">Customer:</p>
                <p>{customer.type}</p>
                <p className="text-sm">Cares about: {customer.concerns.join(', ')}</p>
              </div>
            </div>
          </div>
          
          <p className="text-xl mb-4">
            🎤 Sell them this car! Address their concerns!
          </p>
          
          <div className="text-sm opacity-75 mb-4">
            <p>💡 Mention their interests, create urgency, highlight value</p>
          </div>
          
          {hasAnswered && (
            <div className="mt-4 text-yellow-300">
              <p>The customer is considering your pitch...</p>
              <div className="text-4xl mt-2">💭</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SellCarGameComponent(props: GameProps) {
  return (
    <BaseGame
      title="Sell the Car"
      instructions="You're a car salesperson with a deal on the line! Close the sale!"
      duration={15}
      {...props}
    >
      <SellCarGame />
    </BaseGame>
  );
}