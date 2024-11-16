'use client'

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Shield, Lock, Mail, AlertTriangle } from 'lucide-react'

export default function GameRoom() {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(100)
  const [gameStarted, setGameStarted] = useState(false)
  
  const levels = [
    { id: 1, name: 'Novice', icon: Shield },
    { id: 2, name: 'Intermediate', icon: Lock },
    { id: 3, name: 'Advanced', icon: Mail },
    { id: 4, name: 'Expert', icon: AlertTriangle },
  ]

  useEffect(() => {
    if (gameStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(prev - 1, 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStarted, timeRemaining])

  const startGame = () => {
    setGameStarted(true)
    setTimeRemaining(100)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="mb-8 flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-sm">Agent Smith: 100p</div>
          <div className="text-sm">Agent Johnson: 532p</div>
        </div>
        <div className="w-48">
          <Progress value={timeRemaining} className="h-4 bg-gray-700" indicatorClassName="bg-green-500" />
          <div className="text-xs text-right mt-1">Time Remaining: {timeRemaining}s</div>
        </div>
      </div>

      <h1 className="text-2xl text-center mb-6 text-green-500 font-bold">Phishing Defense Simulator</h1>

      <div className="flex gap-6">
        {/* Levels Sidebar */}
        <div className="w-48 bg-gray-800 p-4 rounded-lg space-y-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`w-full py-2 px-4 rounded text-center transition-colors flex items-center justify-center space-x-2 ${
                selectedLevel === level.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <level.icon className="w-4 h-4" />
              <span>{level.name}</span>
            </button>
          ))}
        </div>

        {/* Main Game Area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col items-center justify-center border border-green-500">
          {!gameStarted ? (
            <div className="text-center">
              <h2 className="text-xl mb-4">Welcome, Cyber Agent!</h2>
              <p className="mb-4">Your mission: Identify and neutralize phishing threats.</p>
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                Start Mission
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl mb-4">Level {selectedLevel}: {levels[selectedLevel - 1].name}</h2>
              <p className="mb-4">Analyze the incoming messages and identify potential threats.</p>
              {/* Placeholder for game content */}
              <div className="bg-gray-700 p-4 rounded-lg w-full max-w-md">
                <p className="text-sm text-gray-300">Simulated phishing email content will appear here...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}