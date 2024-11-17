"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Mail, AlertTriangle } from "lucide-react";
import { redirect , useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GameRoom({ data }) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);

  const channel = new BroadcastChannel("navigation");
  const router = useRouter();

  const levels = [
    { id: 1, name: "Level 1" },
    { id: 2, name: "Level 2" },
    { id: 3, name: "Level 3" },
    { id: 4, name: "Level 4" },
  ];

  useEffect(() => {
    const channel = new BroadcastChannel("navigation");
    console.log("BroadcastChannel initialized"); // Debug log
  
    const handleMessage = (message) => {
      console.log("Message received:", message.data); // Debug log
      const { navigateTo, params } = message.data;

      if (message.data.navigateTo) {
        router.push(message.data.navigateTo);
        router.push(`${navigateTo}?params=${encodeURIComponent(params)}`);
      }
    };
  
    channel.addEventListener("message", handleMessage);
  
    return () => {
      console.log("BroadcastChannel closed"); // Debug log
      channel.close();
    };
  }, []);

  useEffect(() => {
    console.log("Room data:", data);
    if (data !== undefined)
      console.log("Room data id :", data.id);
  }, [data]);

  useEffect(() => {
    let timer;
    if (gameStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining]);

  const startGame = () => {
    fetch(`${BACKEND_URL}/room/${data.id}/start`, {
      method: "POST",
    });
    let targetURL;
    switch (selectedLevel) {
      case 1:
        console.log("Level 1 selected");
        targetURL = `/room/${data.id}/phishing`;
        break;
      case 2:
        console.log("Level 2 selected");
        targetURL = `/room/${data.id}/phishing`;
        break;
      case 3:
        console.log("Level 3 selected");
        break;
      case 4:
        console.log("Level 4 selected");
        break;
      default:
        console.error("Invalid level selected");
    }
    setGameStarted(true);
    setTimeRemaining(100);
    console.log("Game started, routing...");
    channel.postMessage({ navigateTo: targetURL , params: data.id});
    // router.push(targetURL);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkCondition();
    }, 2000);

  });

  const checkCondition = async () => {
    try {
      console.log("Checking condition for room:", data.id);
      const id = data.id;
      const response = await fetch(`${BACKEND_URL}/room/${id}/start`);
      const res = await response.json();
      console.log("Condition data:", res.started);
      if (res.started) {
        startGame();
      }
    } catch (error) {
      console.error("Error checking condition:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="mb-8 flex justify-between items-start">
        <div className="w-48 space-y-2 bg-gray-800 p-4 rounded-lg shadow-lg border border-green-500">
          <h3 className="text-lg font-bold text-green-500 mb-2">
            Agent Scores
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">
              Agent Smith:
            </span>
            <span className="text-sm font-semibold text-green-400">100p</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">
              Agent Johnson:
            </span>
            <span className="text-sm font-semibold text-green-400">532p</span>
          </div>
        </div>

        <div className="w-48">
          <Progress value={timeRemaining} className="h-4 bg-gray-700" />
          <div className="text-xs text-right mt-1">
            Time Remaining: {timeRemaining}s
          </div>
        </div>
      </div>

      <h1 className="text-2xl text-center mb-6 text-green-500 font-bold">
        Cybersecurity Coding Contest
      </h1>

      <div className="flex gap-6">
        {/* Levels Sidebar */}
        <div className="w-48 bg-gray-800 p-4 rounded-lg space-y-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`w-full py-2 px-4 rounded text-center transition-colors flex items-center justify-center space-x-2 ${
                selectedLevel === level.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {/* {React.createElement(level.icon, { className: 'w-4 h-4' })} Fixed icon rendering */}
              <span>{level.name}</span>
            </button>
          ))}
        </div>

        {/* Main Game Area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col items-center justify-center border border-green-500">
          {!gameStarted ? (
            <div className="text-center">
              <h2 className="text-xl mb-4">Welcome, Cyber Agent!</h2>
              <p className="mb-4">
                Your mission: Identify and neutralize phishing threats.
              </p>
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                Start Mission
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                Level {selectedLevel}: {levels[selectedLevel - 1].name}
              </h2>
              <p className="mb-4">
                Analyze the incoming messages and identify potential threats.
              </p>
              {/* Placeholder for game content */}
              <div className="bg-gray-700 p-4 rounded-lg w-full max-w-md">
                <p className="text-sm text-gray-300">
                  Simulated phishing email content will appear here...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
