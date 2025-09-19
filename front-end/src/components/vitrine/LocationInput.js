"use client";
import { useFilterData } from "@/context/FilterDataContext";
import { PiMapPinFill } from "react-icons/pi";

export default function LocationInput() {
  const { updateFilterData } = useFilterData();

  return (
    <div className="w-[23vw]">
      <div className="w-full relative">
        {/* Ícone de localização */}
        <PiMapPinFill className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)] w-4 h-4" />

        {/* Input com valor inicial */}
        <input
          type="text"
          placeholder="Registro, São Paulo, Brasil"
          className="w-full rounded-3xl pl-10 pr-4 py-2 bg-[#EEF0F9] border-0 !text-[var(--primary)] !placeholder-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          onChange={(e) =>
            updateFilterData({
              endereco: e.target.value, // ou localizacao, conforme o back-end
              // zere outros filtros se quiser busca só por endereço
            })
          }
        />
      </div>
    </div>
  );
}
