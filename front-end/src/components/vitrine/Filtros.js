'use client'
import LocationInput from "./LocationInput"
import DropdownFilter from "./DropdownFilter"
import PesquisaAvancada from "./PesquisaAvancada/PesquisaAvancada";
import PesquisaAvancadaMobile from "./PesquisaAvancada/Mobile/PesquisaAvancadaMobile";
import { Flex, Space } from "antd"
import { useFilterData } from "@/context/FilterDataContext";

const optionsBuy = ["Comprar", "Alugar"];
const optionsRooms = ["1", "2", "3", "+4"];
const optionsBathrooms = ["1", "2", "3", "+4"];

// Mapping for display vs backend values
const buyDisplayMapping = {
  "Comprar": "venda",
  "Alugar": "aluguel"
};

const buyBackendMapping = {
  "venda": "Comprar",
  "aluguel": "Alugar"
};

export default function Filtros() {
    const { filterData, updateFilterData } = useFilterData();

    const handleSelectBuy = (option) => {
      const backendValue = buyDisplayMapping[option];
      updateFilterData({ tipo_negociacao: backendValue });
    };

      const handleSelectRooms = (option) => {
        updateFilterData({ quartos: option === "Quartos" ? null : option });
      };

    const handleSelectBathrooms = (option) => {
      updateFilterData({ banheiros: option === "Banheiros" ? null : option });
    };

    const handleCitySearch = (value) => {
    updateFilterData({
      ...filterData,
      citySearch: value || null
    });
  };

    return (
      <>
        {/* Filtros Desktop */}
        <div className="py-7 lg:px-18 md:px-2 hidden md:block">
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Space size="large">
             <LocationInput 
                placeholder="Buscar por cidade..."
                onSelect={handleCitySearch}
                allowClear
                className="w-full"
              />
              <DropdownFilter
                options={optionsBuy}
                selected={buyBackendMapping[filterData.tipo_negociacao] || "Comprar"}
                handleSelect={handleSelectBuy}
                classname={"w-32"}
              />
              <DropdownFilter
                options={optionsRooms}
                placeholder={"Quartos"}
                selected={filterData.quartos || "Quartos"}
                // show label when a number is selected
                displayValue={filterData.quartos ? `Quartos: ${filterData.quartos}` : undefined}
                handleSelect={handleSelectRooms}
                classname={"w-32"}
              />
              <DropdownFilter
                options={optionsBathrooms}
                placeholder={"Banheiros"}
                selected={filterData.banheiros || "Banheiros"}
                // show label when a number is selected
                displayValue={filterData.banheiros ? `Banheiros: ${filterData.banheiros}` : undefined}
                handleSelect={handleSelectBathrooms}
                classname={"w-32"}
              />
            </Space>
            <PesquisaAvancada />
          </Flex>
        </div>

        {/* Filtros Mobile */}
        <div className="md:hidden px-4 py-7">
          <PesquisaAvancadaMobile />
        </div>
      </>
    );
}