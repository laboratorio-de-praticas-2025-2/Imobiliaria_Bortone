"use client";

import { useState } from "react";
import SquaredButton from "./SquaredButton";

export default function RoomsNumber() {
  const [selectedBedroom, setSelectedBedroom] = useState(null);
  const [selectedBathroom, setSelectedBathroom] = useState(null);

  return (
    <div className="pt-7">
      <h2 className="menu-label">Quantidade de cômodos</h2>
        <div className="px-2">

      <p className="text-gray-400 font-semibold pb-0">Quartos</p>
      <div className="flex gap-2 mb-4">
        {["1", "2", "3", "4", "5+"].map((num) => (
          <SquaredButton
            key={num}
            active={selectedBedroom === num}
            onClick={() => 
                setSelectedBedroom(selectedBedroom === num ? null : num)}
          >
            {num}
          </SquaredButton>
        ))}
      </div>

      <p className="text-gray-400 font-semibold ">Banheiros</p>
      <div className="flex gap-2">
        {["1", "2", "3", "4", "5+"].map((num) => (
          <SquaredButton
            key={num}
            active={selectedBathroom === num}
            onClick={() => 
                setSelectedBathroom(selectedBathroom === num ? null : num)}
          >
            {num}
          </SquaredButton>
        ))}
      </div>
      </div> 
    </div>
  );
}
