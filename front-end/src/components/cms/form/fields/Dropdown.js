"use client";
import useHandleClickOutside from "@/hooks/useHandleClickOutside";
import { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { HiX } from "react-icons/hi";

export default function DropdownField({
  options,
  classname,
  selected,
  placeholder,
  handleSelect,
  setSelected,
  width,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useHandleClickOutside(dropdownRef, () => setOpen(false));

  const handleClear = (e) => {
    e.stopPropagation();
    setSelected(placeholder);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-full">
      {/* Botão principal com type="button" */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full custom-input justify-center !rounded-full bg-[#EEF0F9] px-8 py-2 !text-[var(--primary)] font-medium focus:outline-none cursor-pointer hover:bg-[#E0E3F1] transition-colors ${classname}`}
      >
        <p className={`font-bold text-md !mr-2`}>{selected}</p>
        {setSelected && selected !== placeholder ? (
          <HiX
            className="h-4 w-4 text-[var(--primary)] cursor-pointer"
            onClick={handleClear}
          />
        ) : (
          <FaAngleDown className="h-4 w-4 text-[var(--primary)]" />
        )}
      </button>
      
      {/* Menu com altura máxima e scroll */}
      {open && (
        <div className="absolute mt-2 min-w-full right-0 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 z-10">
          <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto"> {/* Altura máxima e scroll */}
            {options.map((option) => (
              <button
                type="button"
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