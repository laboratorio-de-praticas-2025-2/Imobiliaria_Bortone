"use client";
import { useFilterData } from "@/context/FilterDataContext";
import { PiMapPinFill } from "react-icons/pi";
import { useState } from "react";

export default function LocationInput() {
  const { updateFilterData } = useFilterData();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    updateFilterData({ citySearch: inputValue });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBlur = () => {
    handleSearch();
  };

  return (
    <div className="w-[23vw]">
      <div className="w-full relative">
        {/* Ícone de localização */}
        <PiMapPinFill className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)] w-4 h-4" />

        {/* Input com valor inicial */}
        <input
          type="text"
          placeholder="Buscar por cidade..."
          value={inputValue}
          className="w-full rounded-3xl pl-10 pr-4 py-2 bg-[#EEF0F9] border-0 !text-[var(--primary)] !placeholder-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
