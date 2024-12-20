"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Shield, Users } from "lucide-react";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const createRoom = async () => {
  const resp = await fetch(`${BACKEND_URL}/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request: "Salutare!" }),
  }).then((response) => response.json());
  console.log(resp["response"]);

  return resp;
};

function MainPageComponent() {
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    const roomId = await createRoom();
    console.log("The room id is", roomId.roomId);
    setRoomCode(roomId.roomId);
    console.log(`Redirecting to room with code: ${roomId.roomId}`);
    if (roomId.roomId) redirect(`/room/${roomId.roomId}`);
  }

  function handleJoinRoom() {
    console.log(`Redirecting to room with code: ${roomCode}`);
    if (roomCode) redirect(`/room/${roomCode}`);
  }

  return (
    <div className="parent">
      <div className="magicpattern">
        <div className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-green-500 mb-2">
                Day Zero
              </h1>
              <p className="text-lg text-gray-400">
                Test your cybersecurity skills with real-world challenges. Join or create a secure room to begin your mission.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
              <Button
                onClick={handleCreateRoom}
                className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="w-6 h-6" />
                <span>Create Secure Room</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Or join an existing room
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Room Code Input */}
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded"
                />
                <Button
                  onClick={handleJoinRoom}
                  className={`w-full py-6 text-lg ${
                    roomCode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  } transition-colors flex items-center justify-center space-x-2`}
                >
                  <Users className="w-6 h-6" />
                  <span>Join Secure Room</span>
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              By entering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPageComponent;
