import ToggleCasaTerreno from "./ToggleCasaTerreno";
import { useState } from "react";
import SliderPreco from "../SliderPreco";
import SliderArea from "../SliderArea";
import QuantidadeComodos from "../QuantidadeComodos";
import BotaoPesquisar from "../BotaoPesquisar";
import { quantityOptions, quantityVagasOptions } from "@/constants/filters";

export default function PesquisaAvancadaMobile() {
    const [selectedQuartos, setSelectedQuartos] = useState(null);
    const [selectedBanheiros, setSelectedBanheiros] = useState(null);
    const [selectedVagas, setSelectedVagas] = useState(null);
    const [selectedType, setSelectedType] = useState("Casa");
    const [preco, setPreco] = useState([150000, 400000]);
    const [area, setArea] = useState([100, 10000]);

    const handlePesquisar = () => {
      const filtros = {
        tipo: selectedType,
        preco,
        ...(selectedType === "Casa" && {
          quartos: selectedQuartos,
          banheiros: selectedBanheiros,
          vagas: selectedVagas,
        }),
        ...(selectedType === "Terreno" && { area }),
      };

      console.log("Filtros enviados:", filtros);
      // Aqui você pode fazer a requisição com os filtros
    };

    return (
      <div className="p-5 border-1 border-gray-300 rounded-2xl flex gap-10 flex-col">
        <ToggleCasaTerreno
          setSelectedType={setSelectedType}
          selectedType={selectedType}
        />
        <SliderPreco value={preco} onChange={setPreco} />
        {selectedType === "Terreno" && (
          <SliderArea value={area} onChange={setArea} />
        )}
        {selectedType === "Casa" && (
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
      </div>
    );
}