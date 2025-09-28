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
  filterData,
  updateFilterData,
  onAdvancedSearch,
}) {
  const [selectedQuartos, setSelectedQuartos] = useState(filterData.quartos || null);
  const [selectedBanheiros, setSelectedBanheiros] = useState(filterData.banheiros || null);
  const [selectedVagas, setSelectedVagas] = useState(filterData.vagas || null);
  const [selectedTipo, setSelectedTipo] = useState(filterData.tipo || "Casa");
  const [preco, setPreco] = useState(filterData.preco || [150000, 400000]);
  const [area, setArea] = useState(filterData.area || [100, 10000]);
  const [tipoNegocio, setTipoNegocio] = useState(filterData.tipoNegocio || "venda");

  useEffect(() => {
    setSelectedQuartos(filterData.quartos || null);
    setSelectedBanheiros(filterData.banheiros || null);
    setSelectedVagas(filterData.vagas || null);
    setSelectedTipo(filterData.tipo || "Casa");
    setTipoNegocio(filterData.tipoNegocio || "Comprar");
  }, [filterData]);

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
    onAdvancedSearch(filters);
    onClose();
  };

  return (
    <div className="absolute mt-2  md:left-0 z-50 bg-[#DEE1F0] rounded-[10px] border-1 border-[#304383] py-7 px-5 md:px-16 w-[70vw] md:w-[400px]">
      <Flex vertical align="center" justify="center" className="!gap-13">
        <Flex vertical align="start" className="!gap-8 w-[100%]">
          <ToggleCompraAluguel value={tipoNegocio} onChange={setTipoNegocio} />
          <DropdownFilter
            options={options}
            classname="bg-white hover:bg-[#EEF0F9] w-full"
            selected={selectedTipo}
            handleSelect={setSelectedTipo}
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
                setSelected={setSelectedQuartos}
                quantity={quantityOptions}
              />
              <QuantidadeComodos
                title="Banheiros"
                selected={selectedBanheiros}
                setSelected={setSelectedBanheiros}
                quantity={quantityOptions}
              />
              <QuantidadeComodos
                title="Vagas de garagem"
                selected={selectedVagas}
                setSelected={setSelectedVagas}
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
