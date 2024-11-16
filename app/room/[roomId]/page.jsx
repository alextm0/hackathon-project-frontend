"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GameRoom from "../../components/GameRoom";

const BACKEND_URL = "http://localhost:8080";

const getRoomById = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}`);
  const data = await response.json();
  console.log("Fetched room data:", data);
  return data;
};

const toggleAttacker = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/attacker`, {
    method: "PATCH"
  });
};

const toggleDefender = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/defender`, {
    method: "PATCH"
  });
};

function Room() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState();
  const [attackerPresent, setAttackerPresent] = useState();
  const [defenderPresent, setDefenderPresent] = useState();

  console.log("The room id is", roomId);

  useEffect(() => {
    if (roomId) {
      console.log("Fetching data for room ID:", roomId);

      getRoomById(roomId)
      .then((data) => {
        console.log("Fetched room data:", data);
        setRoomData(data);

        if (data.attackerPresent === false) {
          console.log("Attacker is not present");
          toggleAttacker(roomId);
          setAttackerPresent(true);
        } else if (data.defenderPresent === false) {
          console.log("Defender is not present");
          toggleDefender(roomId);
          setDefenderPresent(true);
        }
      })
      .catch((error) => console.error("Failed to fetch room data:", error));
    }
  }, [roomId]);

  if (!roomId) {
    return <p>Room ID not found!</p>;
  }

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      {roomData ? (
        <GameRoom data={roomData} />
      ) : (
        <p>Loading room data...</p>
      )}
    </div>
  );
}

export default Room;
