import { options, quantityOptions, quantityVagasOptions } from "@/mock/filters";
import { Flex } from "antd";
import { useState } from "react";
import DropdownFilter from "@/components/vitrine/DropdownFilter";
import BotaoPesquisar from "@/components/vitrine/PesquisaAvancada/BotaoPesquisar";
import QuantidadeComodos from "@/components/vitrine/PesquisaAvancada/QuantidadeComodos";
import SliderArea from "@/components/vitrine/PesquisaAvancada/SliderArea";
import SliderPreco from "@/components/vitrine/PesquisaAvancada/SliderPreco";
import ToggleCompraAluguel from "@/components/vitrine/PesquisaAvancada/ToggleCompraAluguel";

export default function PesquisaAvancadaModal() {
  const [selectedQuartos, setSelectedQuartos] = useState(null);
  const [selectedBanheiros, setSelectedBanheiros] = useState(null);
  const [selectedVagas, setSelectedVagas] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState("Casa");
  const [preco, setPreco] = useState([150000, 400000]);
  const [area, setArea] = useState([100, 10000]);
  const [tipoNegocio, setTipoNegocio] = useState("Comprar");

  const handlePesquisar = () => {
    const filtros = {
      tipoNegocio,
      tipo: selectedTipo,
      preco,
      ...(selectedTipo === "Casa" && {
        quartos: selectedQuartos,
        banheiros: selectedBanheiros,
        vagas: selectedVagas,
      }),
      ...(selectedTipo === "Terreno" && { area }),
    };

    console.log("Filtros enviados:", filtros);
    // Aqui você pode fazer a requisição com os filtros
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
          <SliderPreco value={preco} onChange={setPreco} />
          {selectedTipo === "Terreno" && (
            <SliderArea value={area} onChange={setArea} />
          )}
          {selectedTipo === "Casa" && (
            <>
              <QuantidadeComodos
                title="QuartosASDASDA"
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
