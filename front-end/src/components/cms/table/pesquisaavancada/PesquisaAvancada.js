'use client';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import PesquisaAvancadaModal from "./PesquisaAvancadaModal";
import { useState } from "react";
import useHandleClickOutside from "@/hooks/useHandleClickOutside";
import { useRef } from "react";

export default function PesquisaAvancadaUser() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useHandleClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative inline-block " ref={dropdownRef}>
      <button
        className={`flex items-center justify-between w-auto gap-2 ${isOpen ? "rounded-t-2xl" : "rounded-2xl"} bg-[#DEE1F0] px-6 py-2 !text-[var(--primary)] focus:outline-none font-bold cursor-pointer hover:bg-[#E0E3F1] transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="mr-2 hidden md:flex whitespace-nowrap">
          Pesquisa avançada
        </p>
        <TbAdjustmentsHorizontal className="h-4 w-4 text-[var(--primary)]" />
      </button>

      {isOpen && <PesquisaAvancadaModal />}
    </div>
  );
}
