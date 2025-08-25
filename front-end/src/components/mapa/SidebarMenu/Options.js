"use client";
import React, { useState } from 'react';
import RectangularButton from './RectangularButton';
import { Col, Row } from 'antd';
import { MdPool } from "react-icons/md";
import { IoMdFlower } from "react-icons/io";
import { PiWallFill } from "react-icons/pi";
export default function Options() {
    
  // Estado para armazenar as opções selecionadas
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Função para lidar com a seleção/desseleção dos botões
  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(optionLabel)) {
        // Se a opção já está selecionada, remove-a
        return prevSelectedOptions.filter((item) => item !== optionLabel);
      } else {
        // Se a opção não está selecionada, adiciona-a
        return [...prevSelectedOptions, optionLabel];
      }
    });
  };

  return (
    <div className='pt-7'>
      <h2 className="menu-label pb-3">Opções</h2>
      <Row>
        <Col span={12} align="left">
            <RectangularButton 
            icon="/icons/piscina.svg" 
            label="Piscina" 
            onClick={() => handleSelectOption("Piscina")}
            // Verifica se "Piscina" está no array de opções selecionadas
            active={selectedOptions.includes("Piscina")}
            children={<MdPool className="w-11 h-11" />}
            />        
        </Col>
        <Col span={12} align="right">
            <RectangularButton 
            icon="/icons/jardim.svg" 
            label="Jardim" 
            onClick={() => handleSelectOption("Jardim")}
            // Verifica se "Jardim" está no array de opções selecionadas
            active={selectedOptions.includes("Jardim")}
            children={<IoMdFlower className="w-11 h-11" />}
            />
        </Col>
      </Row>
      <Row className='pt-5  '>
        <Col span={24} align="center">
            <RectangularButton 
            icon="/icons/murado.svg" 
            label="Murado" 
            onClick={() => handleSelectOption("Murado")}
            // Verifica se "Murado" está no array de opções selecionadas
            active={selectedOptions.includes("Murado")}
            children={<PiWallFill className="w-11 h-11" />}
            />
        </Col>
      </Row>
    </div>
  );
}
