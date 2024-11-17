import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GameRoom({ data }) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);

  const intervalId = useRef(null);
  const channel = new BroadcastChannel("navigation");
  const router = useRouter();

  const levels = [
    { id: 1, name: "Phishing Awareness", icon: "🛡️" },
    { id: 2, name: "Man-in-the-Middle Defense", icon: "🔒" },
    { id: 3, name: "Ransomware Recovery", icon: "💾" },
    {
      id: 4,
      name: "Advanced Threat Analysis (Premium)",
      locked: true,
      icon: "",
    },
    {
      id: 5,
      name: "Advanced Threat Analysis (Premium)",
      locked: true,
      icon: "",
    },
    {
      id: 6,
      name: "Advanced Threat Analysis (Premium)",
      locked: true,
      icon: "",
    },
  ];

  useEffect(() => {
    const channel = new BroadcastChannel("navigation");
    const handleMessage = (message) => {
      const { navigateTo, params } = message.data;
      if (message.data.navigateTo) {
        router.push(`${navigateTo}?params=${encodeURIComponent(params)}`);
      }
    };
    channel.addEventListener("message", handleMessage);
  });

  useEffect(() => {
    let timer;
    if (gameStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining]);

  const getRoomStarted = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/room/${data.id}/start`);
      const res = await response.json();
      return res;
    } catch (error) {
      console.error("Error getting room started:", error);
    }
  };

  const startGame = async () => {
    const res1 = await getRoomStarted(); // Await the promise to resolve
    if (!res1?.started) {
      await fetch(`${BACKEND_URL}/room/${data.id}/start/${selectedLevel}`, {
        method: "POST",
      });
    }

    const res = await getRoomStarted(); // Await the promise to resolve
    console.log("Starting game for room:", res);

    let targetURL;
    switch (res.level) {
      case 1:
        console.log("Level 1 selected");
        targetURL = `/room/${data.id}/phishing`;
        break;
      case 2:
        console.log("Level 2 selected");
        targetURL = `/room/${data.id}/mitm`;
        break;
      case 3:
        console.log("Level 3 selected");
        targetURL = `/room/${data.id}/ransomware`;
        break;
      case 4:
        console.log("Level 4 selected");
        break;
      default:
        console.error("Invalid level selected");
    }
    clearInterval(intervalId.current);
    setGameStarted(true);
    setTimeRemaining(100);
    console.log("Game started, routing...");
    channel.postMessage({ navigateTo: targetURL, params: data.id });
    // router.push(targetURL);
  };

  useEffect(() => {
    if (data && data.id) {
      // Set the interval and store the ID in the ref
      intervalId.current = setInterval(() => {
        checkCondition();
      }, 2000);
    }

    // Cleanup: Clear the interval on unmount or when `data.id` changes
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [data]);

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
      console.error("Error starting game:", error);
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
            <span className="text-sm font-semibold text-gray-300">Me:</span>
            <span className="text-sm font-semibold text-green-400">0p</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">
              Opponent:
            </span>
            <span className="text-sm font-semibold text-green-400">0p</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl text-center mb-6 text-green-500 font-bold">
        Cybersecurity Coding Contest
      </h1>

      <div className="flex gap-6">
        <div className="w-72 bg-gray-800 p-4 rounded-lg space-y-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                if (level.locked) {
                  alert("This level requires a premium subscription.");
                } else {
                  setSelectedLevel(level.id);
                }
              }}
              className={`w-full py-2 px-4 rounded text-center transition-colors flex items-center justify-center space-x-2 ${
                selectedLevel === level.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } ${level.locked ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={level.locked}
            >
              <span className="text-xl">{level.icon}</span>
              <span>{level.name}</span>
              {level.locked && <span className="ml-2 text-red-500">🔒</span>}
            </button>
          ))}
        </div>

        {/* Main Game Area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col items-center justify-center border border-green-500">
          {!gameStarted ? (
            <div className="text-center">
              <h2 className="text-xl mb-4">Welcome, Cyber Agent!</h2>
              <p className="mb-4">
                Your mission: Identify and neutralize malware threats.
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
