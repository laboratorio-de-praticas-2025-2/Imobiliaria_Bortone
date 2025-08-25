"use client";
import { Flex } from 'antd';

export default function SettingsButtons({ onUndo, onApply }) {
  return (
    <div className="flex gap-3 pt-7">
      {/* Botão Desfazer */}
      <button
        onClick={onUndo}
        className=" w-full rounded-lg border-3 border-[#374A8C54] text-gray-400 font-semibold bg-transparent hover:bg-[#1b2235] transition"
      >
        Desfazer
      </button>

      {/* Botão Aplicar */}
      <button
        onClick={onApply}
        className="w-full py-2 rounded-lg bg-[var(--secondary)] text-white font-bold  hover:bg-[#d88500] transition"
      > 
      <Flex align='center' justify='center' >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="white"
          className="w-8 h-8"
          
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Aplicar
      </Flex>

      </button>
    </div>
  );
}
