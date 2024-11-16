"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GameRoom from "../../components/GameRoom";

const BACKEND_URL = "http://localhost:8080";

const getRoomById = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch room data");
  }
  return response.json();
};

const changeStateDefender = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/defender`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to update defender state");
  }
  return response.json();
};

const changeStateAttacker = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/attacker`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to update attacker state");
  }
  return response.json();
};

function Room() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState({
    roomCode: "",
    attackerPresent: false,
    defenderPresent: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const data = await getRoomById(roomId);
        setRoomData({
          roomCode: data.id,
          attackerPresent: data.attackerPresent,
          defenderPresent: data.defenderPresent,
        });

        if (!data.attackerPresent && !data.defenderPresent) {
          await changeStateAttacker(roomId);
        } else if (data.attackerPresent && !data.defenderPresent) {
          await changeStateDefender(roomId);
        } else if (data.attackerPresent && data.defenderPresent) {
          console.log("Both players are present");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]); // Removed roomData dependencies to prevent infinite loops

  if (!roomId) {
    return <p>Room ID not found!</p>;
  }

  if (isLoading) {
    return <p>Loading room data...</p>;
  }

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <GameRoom data={roomData} />
    </div>
  );
}

export default Room;
