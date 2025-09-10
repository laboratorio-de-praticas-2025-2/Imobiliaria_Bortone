"use client";

import { useFilters } from "@/context/FiltersContext";
import { ConfigProvider, Slider } from "antd";
import { useState } from "react";

export default function PriceRange({ children, type }) {
  const { updateFilters } = useFilters();
  const [values, setValues] = useState([25000, 200000]);

  const handlePriceChange = (newValues) => {
    setValues(newValues);

    // Atualiza os filtros no contexto
    updateFilters(type, { preco: newValues });
  };

  return (
    <div className="pt-7">
      <h2 className="menu-label">{children}</h2>
      <p className="text-gray-400 font-semibold">
        {values[0].toLocaleString("pt-Br", {
          minimumFractionDigits: 2,
        })}{" "}
        -{" "}
        {values[1].toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
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
          min={25000}
          max={1000000}
          step={10000}
          value={values}
          onChange={handlePriceChange}
          pushable={0}
        />
      </ConfigProvider>
    </div>
  );
}
