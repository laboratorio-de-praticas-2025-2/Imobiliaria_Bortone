"use client";
import { useFilters } from "@/context/FiltersContext";
import { Col, Row } from "antd";
import { useState } from "react";
import { IoMdFlower } from "react-icons/io";
import { MdPool } from "react-icons/md";
import { PiWallFill } from "react-icons/pi";
import RectangularButton from "./RectangularButton";

export default function Options() {
  const { updateFilters } = useFilters();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(optionLabel)
        ? prevSelectedOptions.filter((item) => item !== optionLabel)
        : [...prevSelectedOptions, optionLabel];
        
      updateFilters("casa", {
        possui_piscina: updatedOptions.includes("Piscina"),
        possui_jardim: updatedOptions.includes("Jardim"),
        murado: updatedOptions.includes("Murado"),
      });

      return updatedOptions;
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
