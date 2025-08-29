import { Flex } from "antd";
import { useState } from "react";
import DropdownFilter from "../DropdownFilter";
import BotaoPesquisar from "./BotaoPesquisar";
import QuantidadeComodos from "./QuantidadeComodos";
import SliderArea from "./SliderArea";
import SliderPreco from "./SliderPreco";
import ToggleCompraAluguel from "./ToggleCompraAluguel";

const options = ["Casa", "Terreno"];
const quantityOptions = ["1", "2", "3", "4+"];
const quantityVagasOptions = ["0", "1", "2", "3+"];

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
    <div className="absolute mt-2 right-0 z-50 bg-[#DEE1F0] rounded-[10px] border-1 border-[#304383] py-7 px-16 min-w-[400px]">
      <Flex vertical align="center" justify="center" className="!gap-13">
        <Flex vertical align="end" className="!gap-8 w-[100%]">
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
