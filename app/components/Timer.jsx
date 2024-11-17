import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Timer({ timeLeft, initialTime }) {
  // Calculate time percentage
  const percentage = (timeLeft / initialTime) * 100;

  // Dynamically update colors based on time remaining
  const getColor = () => {
    if (percentage > 50) return "#16a34a"; // Green
    if (percentage > 20) return "#facc15"; // Yellow
    return "#dc2626"; // Red
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-green-500 flex flex-col items-center">
      <h2 className="text-xl mb-4 flex items-center">
        <Clock className="mr-2" />
        Time Remaining
      </h2>

      {/* Circular Timer */}
      <div className="w-24 h-24">
        <CircularProgressbar
          value={percentage}
          text={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
            .toString()
            .padStart(2, "0")}`}
          styles={buildStyles({
            pathColor: getColor(),
            textColor: getColor(),
            trailColor: "#374151", // Gray trail
            textSize: "16px",
          })}
        />
      </div>
    </div>
  );
}
