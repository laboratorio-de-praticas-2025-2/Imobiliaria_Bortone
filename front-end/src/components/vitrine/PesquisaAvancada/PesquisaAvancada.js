'use client';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import PesquisaAvancadaModal from "./PesquisaAvancadaModal";
import { useState } from "react";

export default function PesquisaAvancada() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button className="flex items-center justify-between w-fit gap-2 rounded-full bg-[#EEF0F9] px-4 py-2 !text-[var(--primary)] focus:outline-none font-bold cursor-pointer hover:bg-[#E0E3F1] transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <TbAdjustmentsHorizontal className="ml-2 h-4 w-4 text-[var(--primary)]" />
        Pesquisa avançada
      </button>
      {isOpen && <PesquisaAvancadaModal />}
    </div>
  );
}
