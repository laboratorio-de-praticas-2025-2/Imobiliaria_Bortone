import { options, quantityOptions, quantityVagasOptions } from "@/mock/filters";
import { Button, Flex } from "antd";
import { useState, useEffect } from "react";
import DropdownFilter from "../DropdownFilter";
import BotaoPesquisar from "./BotaoPesquisar";
import QuantidadeComodos from "./QuantidadeComodos";
import SliderArea from "./SliderArea";
import SliderPreco from "./SliderPreco";
import ToggleCompraAluguel from "./ToggleCompraAluguel";
import { useFilterData } from "@/context/FilterDataContext";

export default function PesquisaAvancadaModal() {
  const [selectedQuartos, setSelectedQuartos] = useState(null);
  const [selectedBanheiros, setSelectedBanheiros] = useState(null);
  const [selectedVagas, setSelectedVagas] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState("Casa");
  const [preco, setPreco] = useState([150000, 400000]);
  const [area, setArea] = useState([100, 10000]);
  const [tipoNegocio, setTipoNegocio] = useState("Comprar");
  const [resetting, setResetting] = useState(false);

  const { updateFilterData } = useFilterData();

  const handlePesquisar = () => {
    const filtros = {
      tipo: selectedTipo,
      status: tipoNegocio === "Comprar" ? "disponível" : "aluguel",
      precoMin: preco[0],
      precoMax: preco[1],
      ...(selectedTipo === "Casa" && {
        quartos: selectedQuartos,
        banheiros: selectedBanheiros,
        vagas: selectedVagas,
      }),
      ...(selectedTipo === "Terreno" && {
        areaMin: area[0],
        areaMax: area[1],
      }),
    };
    updateFilterData(filtros);
  };

  const handleLimparFiltros = () => {
    setSelectedQuartos(null);
    setSelectedBanheiros(null);
    setSelectedVagas(null);
    setSelectedTipo("Casa");
    setPreco([150000, 400000]);
    setArea([100, 10000]);
    setTipoNegocio("Comprar");
    setResetting(true);
  };

  useEffect(() => {
    if (resetting) {
      const filtros = {
        tipo: selectedTipo,
        status: tipoNegocio === "Comprar" ? "disponível" : "aluguel",
        precoMin: preco[0],
        precoMax: preco[1],
        ...(selectedTipo === "Casa" && {
          quartos: selectedQuartos,
          banheiros: selectedBanheiros,
          vagas: selectedVagas,
        }),
        ...(selectedTipo === "Terreno" && {
          areaMin: area[0],
          areaMax: area[1],
        }),
      };
      updateFilterData(filtros);
      setResetting(false);
    }
  }, [resetting, updateFilterData, selectedTipo, tipoNegocio, preco, selectedQuartos, selectedBanheiros, selectedVagas, area]);

  return (
    <div className="absolute mt-2 right-0 z-50 bg-[#DEE1F0] rounded-[10px] border-1 border-[#304383] py-7 px-16 min-w-[400px]">
      <Flex vertical align="center" justify="center" className="!gap-13">
        <Flex vertical align="end" className="!gap-8 w-[100%]">
          <ToggleCompraAluguel value={tipoNegocio} onChange={setTipoNegocio} />
          <Flex
            align="center"
            justify="space-between"
            className="w-[100%] !gap-8"
          >
            <Button className="!rounded-full !border-[var(--primary)] !text-[var(--primary)] !font-medium !h-[34px] hover:!bg-[#EEF0F9]" onClick={handleLimparFiltros}>
              Limpar Filtros
            </Button>
            <DropdownFilter
              options={options}
              classname="bg-white hover:bg-[#EEF0F9] w-full"
              selected={selectedTipo}
              handleSelect={setSelectedTipo}
            />
          </Flex>
          <SliderPreco value={preco} onChange={setPreco} />
          {selectedTipo === "Terreno" && (
            <SliderArea value={area} onChange={setArea} />
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