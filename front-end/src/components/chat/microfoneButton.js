"use client";
import Image from "next/image";

export default function MicrophoneButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                 transform transition-all duration-200 hover:scale-110 hover:shadow-2xl"
    >
      <Image
        src="/images/icons/mic.png"
        alt="Microfone"
        fill
        className="object-contain p-2"
      />
    </button>
  );
}
