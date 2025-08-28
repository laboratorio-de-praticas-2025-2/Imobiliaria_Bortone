"use client";
import React, { useState } from "react";
import RectangularButton from "./RectangularButton";
import { Col, Row } from "antd";
import { MdPool } from "react-icons/md";
import { IoMdFlower } from "react-icons/io";
import { PiWallFill } from "react-icons/pi";

export default function Options() {
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
    <div className="pt-7">
      <h2 className="menu-label pb-3">Opções</h2>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={8} sm={24} md={12} align="center">
          <RectangularButton
            icon="/icons/piscina.svg"
            label="Piscina"
            onClick={() => handleSelectOption("Piscina")}
            active={selectedOptions.includes("Piscina")}
          >
            <MdPool className="w-11 h-11" />
          </RectangularButton>
        </Col>
        <Col xs={8} sm={24} md={12} align="center">
          <RectangularButton
            icon="/icons/jardim.svg"
            label="Jardim"
            onClick={() => handleSelectOption("Jardim")}
            active={selectedOptions.includes("Jardim")}
          >
            <IoMdFlower className="w-11 h-11" />
          </RectangularButton>
        </Col>
        <Col xs={8} sm={24} md={12} align="center">
          <RectangularButton
            icon="/icons/murado.svg"
            label="Murado"
            onClick={() => handleSelectOption("Murado")}
            active={selectedOptions.includes("Murado")}
          >
            <PiWallFill className="w-11 h-11" />
          </RectangularButton>
        </Col>
      </Row>
    </div>
  );
}
