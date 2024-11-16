"use client"

import { useParams } from 'next/navigation';
import React from 'react';

import GameRoom from '../../components/GameRoom'

function Room() {
  const { roomId } = useParams();

  return (
    <div>
      <GameRoom />
    </div>
  );
}

export default Room;
