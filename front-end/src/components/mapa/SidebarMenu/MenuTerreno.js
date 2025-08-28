"use client";

import PropertyType from './PropertyType';
import PriceRange from './PriceRange';
import { Col, Row } from "antd";
import PropertySize from './PropertySize';
import Location from './Location';
import SettingsButtons from './SettingsButtons';
import RectangularButton from './RectangularButton';
import { useState } from 'react';
import { PiWallFill } from "react-icons/pi";

export default function MenuTerreno({ activeType, setActiveType }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(optionLabel)) {
        return prevSelectedOptions.filter((item) => item !== optionLabel);
      } else {
        return [...prevSelectedOptions, optionLabel];
      }
    });
  };

  return (
    <div className="grid h-full content-between">
      <div>
        <PropertyType activeType={activeType} setActiveType={setActiveType} />
        <PriceRange>Faixa de preço</PriceRange>
        <PropertySize>Tamanho da Propriedade</PropertySize>
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
        <SettingsButtons />
      </div>
    </div>
  );
}
