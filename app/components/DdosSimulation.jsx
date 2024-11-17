"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Zap, Server } from "lucide-react";

const MAX_ATTACK_STRENGTH = 100;
const MAX_DEFENSE_STRENGTH = 80;
const SIMULATION_DURATION = 60;

export default function DDoSSimulation() {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [attackStrength, setAttackStrength] = useState(0);
  const [defenseStrength, setDefenseStrength] = useState(0);
  const [serverHealth, setServerHealth] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [defenses, setDefenses] = useState({
    firewall: false,
    loadBalancer: false,
    trafficFilter: false,
  });
  const [eventLog, setEventLog] = useState([]);

  const logEvent = (message) => {
    setEventLog((prev) => [...prev, `[${elapsedTime}s] ${message}`]);
  };

  const updateServerHealth = () => {
    const damage = Math.max(0, attackStrength - defenseStrength);
    const healthChange = Math.max(0, serverHealth - damage / 10);
    if (healthChange < serverHealth) logEvent("Server took damage!");
    setServerHealth(healthChange);
  };

  useEffect(() => {
    let interval;
    if (isSimulationRunning && elapsedTime < SIMULATION_DURATION) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        updateServerHealth();

        // Simulated attack pattern
        const timePercentage = (elapsedTime / SIMULATION_DURATION) * 100;
        if (timePercentage < 20) {
          setAttackStrength(20);
        } else if (timePercentage < 40) {
          setAttackStrength(50);
        } else if (timePercentage < 60) {
          setAttackStrength(80);
        } else if (timePercentage < 80) {
          setAttackStrength(100);
        } else {
          setAttackStrength(70);
        }

        // Simulated defense response
        const activeDefenses = Object.values(defenses).filter(Boolean).length;
        setDefenseStrength(20 * activeDefenses);
      }, 1000);
    } else if (elapsedTime >= SIMULATION_DURATION) {
      setIsSimulationRunning(false);
      logEvent("Simulation ended!");
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, elapsedTime, defenses]);

  const toggleDefense = (defense) => {
    setDefenses((prev) => {
      const updated = { ...prev, [defense]: !prev[defense] };
      logEvent(`${defense} ${updated[defense] ? "activated" : "deactivated"}`);
      return updated;
    });
  };

  const startSimulation = () => {
    setIsSimulationRunning(true);
    setServerHealth(100);
    setElapsedTime(0);
    setEventLog([]);
    logEvent("Simulation started!");
  };

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setAttackStrength(0);
    setDefenseStrength(0);
    setServerHealth(100);
    setElapsedTime(0);
    setDefenses({ firewall: false, loadBalancer: false, trafficFilter: false });
    setEventLog([]);
    logEvent("Simulation reset!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center">
        DDoS Attack Simulation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attack Dashboard */}
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
          <h2 className="text-xl mb-4">Attack Dashboard</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Attack Strength</span>
                <span>{attackStrength}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded">
                <div
                  className={`absolute h-full rounded bg-red-500 transition-all`}
                  style={{ width: `${attackStrength}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Bots</span>
              <div className="space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Zap
                    key={i}
                    className={`inline-block w-4 h-4 ${
                      i < attackStrength / 20 ? "text-red-500" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Defense Dashboard */}
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
          <h2 className="text-xl mb-4">Defense Dashboard</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Defense Strength</span>
                <span>{defenseStrength}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded">
                <div
                  className={`absolute h-full rounded bg-blue-500 transition-all`}
                  style={{ width: `${defenseStrength}%` }}
                />
              </div>
            </div>
            {Object.entries(defenses).map(([defense, isActive]) => (
              <div key={defense} className="flex items-center justify-between">
                <label
                  className="capitalize text-green-500"
                  htmlFor={`switch-${defense}`}
                >
                  {defense.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <Switch
                  id={`switch-${defense}`}
                  checked={isActive}
                  onCheckedChange={() => {
                    if (!isSimulationRunning) {
                      toggleDefense(defense);
                    } else {
                      logEvent(
                        `Cannot toggle ${defense} while simulation is running.`
                      );
                    }
                  }}
                  className={`relative inline-flex items-center h-6 rounded-full w-12 transition-all ${
                    isActive ? "bg-blue-500" : "bg-gray-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Server Status */}
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 col-span-1 md:col-span-2">
          <h2 className="text-xl mb-4">Server Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Server Health</span>
                <span>{serverHealth.toFixed(2)}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded">
                <div
                  className={`absolute h-full rounded ${
                    serverHealth > 50 ? "bg-green-500" : "bg-red-500"
                  } transition-all`}
                  style={{ width: `${serverHealth}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Server
                className={`w-16 h-16 ${
                  serverHealth > 50 ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Simulation Progress</span>
                <span>
                  {elapsedTime}/{SIMULATION_DURATION}s
                </span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded">
                <div
                  className="absolute h-full bg-green-500 rounded transition-all"
                  style={{
                    width: `${(elapsedTime / SIMULATION_DURATION) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <Button
          onClick={startSimulation}
          disabled={isSimulationRunning}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Start Simulation
        </Button>
        <Button
          onClick={resetSimulation}
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-900"
        >
          Reset
        </Button>
      </div>

      {/* Event Log */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg border border-green-500">
        <h2 className="text-xl font-bold mb-4">Simulation Insights</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          {eventLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
