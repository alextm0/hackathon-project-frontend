"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, Zap } from "lucide-react";

export default function Component() {
  const [serverHealth, setServerHealth] = useState(100);
  const [attackIntensity, setAttackIntensity] = useState(0);
  const [botCount, setBotCount] = useState(10);
  const [isAttacking, setIsAttacking] = useState(false);
  const [defenses, setDefenses] = useState({
    firewall: false,
    loadBalancer: false,
    trafficFilter: false,
  });
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setGameOver(true);
    }
  }, [timeRemaining, gameOver]);

  useEffect(() => {
    if (isAttacking && !gameOver) {
      const interval = setInterval(() => {
        const defenseStrength = Object.values(defenses).filter(Boolean).length * 20;
        const attackStrength = (attackIntensity * botCount) / 10;
        const damage = Math.max(0, attackStrength - defenseStrength);

        setServerHealth((prev) => {
          const newHealth = Math.max(0, prev - damage / 10);
          if (newHealth === 0) setGameOver(true);
          return newHealth;
        });

        setScore((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAttacking, attackIntensity, botCount, defenses, gameOver]);

  const toggleDefense = (defense) => {
    setDefenses((prev) => ({ ...prev, [defense]: !prev[defense] }));
  };

  const resetGame = () => {
    setServerHealth(100);
    setAttackIntensity(0);
    setBotCount(10);
    setIsAttacking(false);
    setDefenses({ firewall: false, loadBalancer: false, trafficFilter: false });
    setScore(0);
    setTimeRemaining(60);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-500">
        DDoS Attack Simulator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Server Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Server Health</span>
                <span>{serverHealth.toFixed(2)}%</span>
              </div>
              <Progress value={serverHealth} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Time Remaining</span>
                <span>{timeRemaining}s</span>
              </div>
              <Progress value={(timeRemaining / 60) * 100} className="h-2" />
            </div>
            <div>Score: {score}</div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Attack Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Bot Count: {botCount}</label>
              <Slider
                value={[botCount]}
                onValueChange={(value) => setBotCount(value[0])}
                max={100}
                step={1}
              />
            </div>
            <div>
              <label className="block mb-2">Attack Intensity: {attackIntensity}</label>
              <Slider
                value={[attackIntensity]}
                onValueChange={(value) => setAttackIntensity(value[0])}
                max={10}
                step={1}
              />
            </div>
            <Button
              onClick={() => setIsAttacking(!isAttacking)}
              variant={isAttacking ? "destructive" : "default"}
              disabled={gameOver}
            >
              {isAttacking ? "Stop Attack" : "Start Attack"}
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Defense Mechanisms</h2>
          <div className="space-y-4">
            {Object.entries(defenses).map(([defense, isActive]) => (
              <div key={defense} className="flex items-center justify-between">
                <label className="capitalize">
                  {defense.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleDefense(defense)}
                  disabled={gameOver}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Visualization</h2>
          <div className="h-48 bg-gray-700 relative overflow-hidden rounded-lg">
            {Array.from({ length: botCount }).map((_, i) => (
              <Zap
                key={i}
                className="absolute text-red-500"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: isAttacking
                    ? `blink 0.${10 - attackIntensity}s infinite`
                    : "none",
                }}
              />
            ))}
            <AlertCircle
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl ${
                serverHealth < 50 ? "text-red-500" : "text-green-500"
              }`}
            />
            {Object.entries(defenses).map(
              ([defense, isActive], index) =>
                isActive && (
                  <Shield
                    key={defense}
                    className="absolute text-blue-500 text-2xl"
                    style={{
                      left: `${25 * (index + 1)}%`,
                      bottom: "10%",
                    }}
                  />
                )
            )}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-2xl mb-4">Game Over</h2>
            <div className="mb-4">Your final score: {score}</div>
            <Button onClick={resetGame}>Play Again</Button>
          </div>
        </div>
      )}


    </div>
  );
}
