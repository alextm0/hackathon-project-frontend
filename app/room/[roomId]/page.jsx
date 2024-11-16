"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GameRoom from "../../components/GameRoom";

const BACKEND_URL = "http://localhost:8080";

const getRoomById = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}`);
  const data = await response.json();
  return data;
};

function Room() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState();

  console.log("The room id is", roomId);

  useEffect(() => {
    if (roomId) {
      console.log("Fetching data for room ID:", roomId);
      getRoomById(roomId)
        .then((data) => setRoomData(data))
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
