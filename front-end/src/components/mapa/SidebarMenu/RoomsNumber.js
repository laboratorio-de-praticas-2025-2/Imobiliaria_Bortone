"use client";

import { useFilters } from "@/context/FiltersContext";
import { useState } from "react";
import SquaredButton from "./SquaredButton";

export default function RoomsNumber() {
  const { updateFilters } = useFilters();
  const [selectedBedroom, setSelectedBedroom] = useState(null);
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [selectedVagas, setSelectedVagas] = useState(null);

  const handleBedroomClick = (num) => {
    const newValue = selectedBedroom === num ? null : num;
    setSelectedBedroom(newValue);
    updateFilters("casa", { quartos: newValue });
  };

  const handleBathroomClick = (num) => {
    const newValue = selectedBathroom === num ? null : num;
    setSelectedBathroom(newValue);
    updateFilters("casa", { banheiros: newValue });
  };

  const handleVagasClick = (num) => {
    const newValue = selectedVagas === num ? null : num;
    setSelectedVagas(newValue);
    updateFilters("casa", { vagas: newValue });
  };

  return (
    <div className="pt-7">
      <h2 className="menu-label">Quantidade de cômodos</h2>
      <div className="px-2">
        <p className="text-gray-400 font-semibold pb-2">Quartos</p>
        <div className="flex gap-2 mb-4">
          {["1", "2", "3", "4", "5+"].map((num) => (
            <SquaredButton
              key={num}
              active={selectedBedroom === num}
              onClick={() => handleBedroomClick(num)}
            >
              {num}
            </SquaredButton>
          ))}
        </div>

        <p className="text-gray-400 font-semibold pb-2">Banheiros</p>
        <div className="flex gap-2 mb-4">
          {["1", "2", "3", "4", "5+"].map((num) => (
            <SquaredButton
              key={num}
              active={selectedBathroom === num}
              onClick={() => handleBathroomClick(num)}
            >
              {num}
            </SquaredButton>
          ))}
        </div>

        <p className="text-gray-400 font-semibold pb-2">Vagas de garagem</p>
        <div className="flex gap-2 mb-4">
          {["1", "2", "3", "4", "5+"].map((num) => (
            <SquaredButton
              key={num}
              active={selectedVagas === num}
              onClick={() => handleVagasClick(num)}
            >
              {num}
            </SquaredButton>
          ))}
        </div>
      </div>
    </div>
  );
}
