// components/chat/ChatButton.js
"use client";

import Image from "next/image";
import { BsChatText } from "react-icons/bs";

export default function ChatButton({ onClick, className = "" }) {
  return (


      <BsChatText  onClick={onClick} aria-label="Abrir chat de suporte" 
        className="object-contain fixed bottom-5 right-5 z-[9998] bg-white rounded-xl shadow-lg
         w-12 h-12 md:w-14 md:h-14 flex items-center justify-center p-2
         transform transition duration-200 hover:scale-110 hover:shadow-2xl" color="#4C62AE" />

  );
}
