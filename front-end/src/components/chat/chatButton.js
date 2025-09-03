// components/chat/ChatButton.js
"use client";

import Image from "next/image";

export default function ChatButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir chat de suporte"
      className={
        `fixed bottom-5 right-5 z-[9998] bg-white rounded-xl shadow-lg
         w-12 h-12 md:w-14 md:h-14 flex items-center justify-center
         transform transition duration-200 hover:scale-110 hover:shadow-2xl ` +
        className
      }
    >
      <Image
        src="/images/icons/chat.png"
        alt="Abrir chat de suporte"
        width={28}
        height={28}
        className="object-contain"
        priority
      />
    </button>
  );
}
