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

export default function Filtros() {
    const { filterData, updateFilterData } = useFilterData();

    const handleSelectBuy = (option) => {
      updateFilterData({ tipo_negociacao: option });
    };

    const handleSelectRooms = (option) => {
      updateFilterData({ quartos: option === "Quartos" ? null : option });
    };

    const handleSelectBathrooms = (option) => {
      updateFilterData({ banheiros: option === "Banheiros" ? null : option });
    };

    return (
      <>
        {/* Filtros Desktop */}
        <div className="py-7 lg:px-18 md:px-2 hidden md:block">
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Space size="large">
              <LocationInput />
              <DropdownFilter
                options={optionsBuy}
                selected={filterData.tipo_negociacao}
                handleSelect={handleSelectBuy}
                classname={"w-32"}
              />
              <DropdownFilter
                options={optionsRooms}
                placeholder={"Quartos"}
                selected={filterData.quartos || "Quartos"}
                handleSelect={handleSelectRooms}
                setSelected={(value) => updateFilterData({ quartos: value === "Quartos" ? null : value })}
                classname={"w-32"}
              />
              <DropdownFilter
                options={optionsBathrooms}
                placeholder={"Banheiros"}
                selected={filterData.banheiros || "Banheiros"}
                handleSelect={handleSelectBathrooms}
                setSelected={(value) => updateFilterData({ banheiros: value === "Banheiros" ? null : value })}
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