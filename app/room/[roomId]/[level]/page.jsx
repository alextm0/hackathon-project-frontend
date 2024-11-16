import React from "react";

function CurrentLevel() {
  return (
    <div>
      <div className="w-[1440px] h-[1024px] relative">
        <div className="w-[878px] h-[387px] left-[281px] top-[318px] absolute bg-[#0a5a0a]/80 rounded-[78px] shadow-inner border-4 border-[#2bb92b]" />
        <div className="w-[395px] h-28 left-[299px] top-[456px] absolute bg-[#2bb92b] rounded-[25px] border-2 border-black" />
        <div className="w-[395px] h-28 left-[745px] top-[456px] absolute bg-[#2bb92b] rounded-[25px] border-2 border-black" />
        <div className="w-[229px] h-[38px] left-[382px] top-[501px] absolute text-[#1e1e1e] text-4xl font-normal font-['Luckiest Guy']">
          Create room
          <br />
        </div>
        <div className="w-[184px] h-[26px] left-[851px] top-[499px] absolute text-[#1e1e1e] text-4xl font-normal font-['Luckiest Guy']">
          Join room
        </div>
      </div>
    </div>
  );
}

export default CurrentLevel;
