"use client";

import { useFilters } from "@/context/FiltersContext";
import { Col, Row } from "antd";
import { useState } from "react";
import { PiWallFill } from "react-icons/pi";
import Location from "./Location";
import PriceRange from "./PriceRange";
import PropertySize from "./PropertySize";
import PropertyType from "./PropertyType";
import RectangularButton from "./RectangularButton";
import SettingsButtons from "./SettingsButtons";

export default function MenuTerreno({ activeType, setActiveType }) {
  const { updateFilters } = useFilters();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(optionLabel)
        ? prevSelectedOptions.filter((item) => item !== optionLabel)
        : [...prevSelectedOptions, optionLabel];

      // Atualiza os filtros no contexto
      updateFilters("terreno", { murado: updatedOptions.includes("Murado") });

      return updatedOptions;
    });
  };

  return (
    <div className="grid h-full content-between">
      <div>
        <PropertyType activeType={activeType} setActiveType={setActiveType} />
        <PriceRange type="terreno">Faixa de preço</PriceRange>
        <PropertySize type="terreno">Tamanho da Propriedade</PropertySize>
      </div>
      <div className="pt-7">
        <h2 className="menu-label pb-3">Opções</h2>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={8} sm={24} md={12} align="center">
            <RectangularButton
              label="Murado"
              onClick={() => handleSelectOption("Murado")}
              active={selectedOptions.includes("Murado")}
            >
              <PiWallFill className="w-11 h-11" />
            </RectangularButton>
          </Col>
        </Row>
      </div>
      <div className="pb-15">
        <Location />
        <SettingsButtons type={"terreno"} />
      </div>
    </div>
  );
}
