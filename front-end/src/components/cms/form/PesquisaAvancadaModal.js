import { options, quantityOptions, quantityVagasOptions } from "@/mock/filters";
import { Flex } from "antd";
import { useState, useEffect } from "react";
import DropdownFilter from "@/components/vitrine/DropdownFilter";
import BotaoPesquisar from "@/components/vitrine/PesquisaAvancada/BotaoPesquisar";
import QuantidadeComodos from "@/components/vitrine/PesquisaAvancada/QuantidadeComodos";
import SliderArea from "@/components/vitrine/PesquisaAvancada/SliderArea";
import SliderPreco from "@/components/vitrine/PesquisaAvancada/SliderPreco";
import ToggleCompraAluguel from "@/components/vitrine/PesquisaAvancada/ToggleCompraAluguel";

export default function PesquisaAvancadaModal({
  onClose,
  filterData = {},
  updateFilterData,
  onAdvancedSearch,
}) {
  const [selectedQuartos, setSelectedQuartos] = useState(null);
  const [selectedBanheiros, setSelectedBanheiros] = useState(null);
  const [selectedVagas, setSelectedVagas] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState("Casa");
  const [preco, setPreco] = useState([150000, 400000]);
  const [area, setArea] = useState([100, 10000]);
  const [tipoNegocio, setTipoNegocio] = useState("Comprar");

  // Debug: Track state changes
  useEffect(() => {
    console.log("State updated - selectedTipo:", selectedTipo, "tipoNegocio:", tipoNegocio);
  }, [selectedTipo, tipoNegocio, selectedQuartos, selectedBanheiros, selectedVagas]);

  const handlePesquisar = () => {
    const filters = {
      tipoNegocio,
      tipo: selectedTipo,
      preco,
      quartos: selectedTipo === "Casa" ? selectedQuartos : null,
      banheiros: selectedTipo === "Casa" ? selectedBanheiros : null,
      vagas: selectedTipo === "Casa" ? selectedVagas : null,
    };
    if (selectedTipo === "Terreno") {
      filters.area = area;
    }
    
    console.log("handlePesquisar - filters:", filters);
    console.log("handlePesquisar - onAdvancedSearch:", typeof onAdvancedSearch);
    
    if (typeof onAdvancedSearch === 'function') {
      onAdvancedSearch(filters);
    } else {
      console.error("onAdvancedSearch is not a function:", onAdvancedSearch);
    }
    onClose();
  };

  return (
    <div className="absolute mt-2  md:left-0 z-50 bg-[#DEE1F0] rounded-[10px] border-1 border-[#304383] py-7 px-5 md:px-16 w-[70vw] md:w-[400px]">
      <Flex vertical align="center" justify="center" className="!gap-13">
        <Flex vertical align="start" className="!gap-8 w-[100%]">
          <ToggleCompraAluguel value={tipoNegocio} onChange={(value) => {
            console.log("ToggleCompraAluguel changed to:", value);
            setTipoNegocio(value);
          }} />
          <DropdownFilter
            options={options}
            classname="bg-white hover:bg-[#EEF0F9] w-full"
            selected={selectedTipo}
            handleSelect={(value) => {
              console.log("DropdownFilter changed to:", value);
              setSelectedTipo(value);
            }}
          />
          <SliderPreco value={preco} onChange={(value) => { 
            console.log("SliderPreco changed to:", value); 
            setPreco(value); 
            // updateFilterData({ preco: value }); 
          }} />
          {selectedTipo === "Terreno" && (
            <SliderArea value={area} onChange={(value) => { 
              console.log("SliderArea changed to:", value); 
              setArea(value); 
              // updateFilterData({ area: value }); 
            }} />
          )}
          {selectedTipo === "Casa" && (
            <>
              <QuantidadeComodos
                title="Quartos"
                selected={selectedQuartos}
                setSelected={(value) => {
                  console.log("Quartos changed to:", value);
                  setSelectedQuartos(value);
                }}
                quantity={quantityOptions}
              />
              <QuantidadeComodos
                title="Banheiros"
                selected={selectedBanheiros}
                setSelected={(value) => {
                  console.log("Banheiros changed to:", value);
                  setSelectedBanheiros(value);
                }}
                quantity={quantityOptions}
              />
              <QuantidadeComodos
                title="Vagas de garagem"
                selected={selectedVagas}
                setSelected={(value) => {
                  console.log("Vagas changed to:", value);
                  setSelectedVagas(value);
                }}
                quantity={quantityVagasOptions}
              />
            </>
          )}
          <BotaoPesquisar onClick={handlePesquisar} />
        </Flex>
      </Flex>
    </div>
  );
}
