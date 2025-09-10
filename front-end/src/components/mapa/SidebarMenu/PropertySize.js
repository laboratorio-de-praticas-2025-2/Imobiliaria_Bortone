"use client";

import { Slider, ConfigProvider } from "antd";
import { useState } from "react";
import { useFilters } from "@/context/FiltersContext";

export default function PropertySize({ children, type }) {
  const [values, setValues] = useState([0, 200]); // Estado inicial
  const { updateFilters } = useFilters();
  
  const handleSizeChange = (newValues) => {
    setValues(newValues);

    // Atualiza os filtros no contexto
    updateFilters(type, { area: newValues });
  };

  return (
    <div className="pt-7">
      <h2 className="menu-label">{children}</h2>

      {/* Exibição do intervalo em m² */}
      <p className="text-gray-400 font-semibold">
        {values[0]} m² - {values[1]} m²
      </p>

      <ConfigProvider
        theme={{
          components: {
            Slider: {
              railBg: "white", // trilha vazia
              trackBg: "var(--secondary)", // preenchida
              trackHoverBg: "var(--secondary)",
              handleColor: "var(--secondary)",
              handleActiveColor: "var(--secondary)",
              dotSize: 100,
            },
          },
        }}
      >
        <Slider
          range={{ draggableTrack: true }}
          min={0}
          max={1000}
          step={10}
          value={values}
          onChange={handleSizeChange} // atualiza o estado ao arrastar
          pushable={0}
        />
      </ConfigProvider>
    </div>
  );
}
