"use client";
import React, { useState } from 'react';
import LocationButton from './LocationButton';
import { Space, Col, Row } from 'antd';

export default function Location() {
    
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
      <h2 className="menu-label pb-5">Localização</h2>
      <Row gutter={[16, 16]} justify="center" >
        <Col span={8} align="center">
            <LocationButton 
            label="Bairro 1" 
            onClick={() => handleSelectOption("Bairro 1")}
            // Verifica se "Piscina" está no array de opções selecionadas
            active={selectedOptions.includes("Bairro 1")}
            />        
        </Col>
        <Col span={8} align="center">
            <LocationButton 
            icon="/icons/jardim.svg" 
            label="Bairro 2" 
            onClick={() => handleSelectOption("Bairro 2")}
            // Verifica se "Jardim" está no array de opções selecionadas
            active={selectedOptions.includes("Bairro 2")}
            />
        </Col>
        <Col span={8} align="center">
            <LocationButton 
            icon="/icons/jardim.svg" 
            label="Bairro 3" 
            onClick={() => handleSelectOption("Bairro 3")}
            // Verifica se "Jardim" está no array de opções selecionadas
            active={selectedOptions.includes("Bairro 3")}
            />
        </Col>
      </Row>
      <Row className='pt-5 '>
        <Col span={12} align="right" className="pr-2">
            <LocationButton 
            icon="/icons/murado.svg" 
            label="Bairro 4" 
            onClick={() => handleSelectOption("Bairro 4")}
            // Verifica se "Murado" está no array de opções selecionadas
            active={selectedOptions.includes("Bairro 4")}
            />
        </Col>
        <Col span={12} align="left" className="pl-2">
            <LocationButton 
            icon="/icons/murado.svg" 
            label="Bairro 5" 
            onClick={() => handleSelectOption("Bairro 5")}
            // Verifica se "Murado" está no array de opções selecionadas
            active={selectedOptions.includes("Bairro 5")}
            />
        </Col>
      </Row>
    </div>
  );
}
