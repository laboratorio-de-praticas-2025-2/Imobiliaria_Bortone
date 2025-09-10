"use client";
import { useFilters } from "@/context/FiltersContext";
import { Col, Row } from "antd";
import { useState } from "react";
import LocationButton from "./LocationButton";

export default function Location() {
  const { updateFilters } = useFilters();
  // Estado para armazenar as opções selecionadas
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Função para lidar com a seleção/desseleção dos botões
  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(optionLabel)
        ? prevSelectedOptions.filter((item) => item !== optionLabel)
        : [...prevSelectedOptions, optionLabel];

      // Atualiza os filtros no contexto
      updateFilters("terreno", { localizacao: updatedOptions });
      return updatedOptions;
    });
  };

  return (
    <div className="pt-7">
      <h2 className="menu-label pb-5">Localização</h2>
      <Row gutter={[16, 16]} justify="center">
        <Col span={8} align="center">
          <LocationButton
            label="Bairro 1"
            onClick={() => handleSelectOption("Bairro 1")}
            active={selectedOptions.includes("Bairro 1")}
          />
        </Col>
        <Col span={8} align="center">
            <LocationButton 
            label="Bairro 2" 
            onClick={() => handleSelectOption("Bairro 2")}
            active={selectedOptions.includes("Bairro 2")}
          />
        </Col>
        <Col span={8} align="center">
            <LocationButton 
            label="Bairro 3" 
            onClick={() => handleSelectOption("Bairro 3")}
            active={selectedOptions.includes("Bairro 3")}
          />
        </Col>
      </Row>
      <Row className="pt-5 ">
        <Col span={12} align="right" className="pr-2">
            <LocationButton 
            label="Bairro 4"
            onClick={() => handleSelectOption("Bairro 4")}
            active={selectedOptions.includes("Bairro 4")}
          />
        </Col>
        <Col span={12} align="left" className="pl-2">
            <LocationButton 
            label="Bairro 5" 
            onClick={() => handleSelectOption("Bairro 5")}
            active={selectedOptions.includes("Bairro 5")}
          />
        </Col>
      </Row>
    </div>
  );
}
