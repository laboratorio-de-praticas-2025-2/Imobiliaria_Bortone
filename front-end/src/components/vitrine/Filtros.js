'use client'
import LocationInput from "./LocationInput"
import DropdownFilter from "./DropdownFilter"
import PesquisaAvancada from "./PesquisaAvancada/PesquisaAvancada";
import { Flex, Space } from "antd"
import { useState } from "react";

const optionsBuy = ["Comprar", "Alugar"];
const optionsRooms = ["1", "2", "3", "+4"];
const optionsBathrooms = ["1", "2", "3", "+4"];

export default function Filtros() {
    const [selectedBuy, setSelectedBuy] = useState(optionsBuy[0]);
    const [selectedRooms, setSelectedRooms] = useState("Quartos");
    const [selectedBathrooms, setSelectedBathrooms] = useState("Banheiros");

    const handleSelectBuy = (option) => {
        setSelectedBuy(option);
    };

    const handleSelectRooms = (option) => {
        setSelectedRooms(option);
    }

    const handleSelectBathrooms = (option) => {
        setSelectedBathrooms(option);
    }

    return (
      <div className="py-7 px-18">
        <Flex justify="space-between" style={{ width: "100%" }}>
          <Space size="large">
            <LocationInput />
            <DropdownFilter
              options={optionsBuy}
              selected={selectedBuy}
              handleSelect={handleSelectBuy}
            />
            <DropdownFilter 
                options={optionsRooms} 
                placeholder={"Quartos"} 
                selected={selectedRooms}
                handleSelect={handleSelectRooms}
                setSelected={setSelectedRooms}
            />
            <DropdownFilter
              options={optionsBathrooms}
              placeholder={"Banheiros"}
                selected={selectedBathrooms}
                handleSelect={handleSelectBathrooms}
                setSelected={setSelectedBathrooms}
            />
          </Space>
          <PesquisaAvancada />
        </Flex>
      </div>
    );
}