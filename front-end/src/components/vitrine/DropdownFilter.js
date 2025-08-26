"use client";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";

export default function DropdownFilter({options, placeholder}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder || options[0]);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Botão */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-32 rounded-full bg-[#EEF0F9] px-4 py-2 !text-[var(--primary)] font-medium focus:outline-none"
      >
        {selected}
        <FaAngleDown className="ml-2 h-4 w-4 text-[var(--primary)]" />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute mt-2 w-32 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 z-10">
          <div className="flex flex-col gap-0.5">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 !text-[var(--primary)] rounded-2xl hover:bg-[#EEF0F9] text-left ${
                  option === selected ? "bg-[#EEF0F9]" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
