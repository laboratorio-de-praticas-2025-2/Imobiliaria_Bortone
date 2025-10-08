import ImovelCard from "@/components/home/ImovelCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropriedadesSelecionadas() {
  const [imoveis, setImoveis] = useState([]);
  const [modo, setModo] = useState("comprar");

  const imoveisFiltrados = imoveis.filter((imovel) =>
    modo === "comprar" ? imovel.tipo === "comprar" : imovel.tipo === "alugar"
  );

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) return;

    const fetchRecomendacoes = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/recomendacoes`,
          { params: { usuario_id: userInfo.id } }
        );
        setImoveis(res.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar recomendações:", err);
      }
    };

    fetchRecomendacoes();
  }, []);

  useEffect(() => {
    console.log("Imóveis recomendados:", imoveis);
  }, [imoveis]);

  return (
    <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
      <div className="flex flex-row justify-between">
        <p className="lemon-milk md:text-3xl text-xl text-[var(--primary)]">
          IMÓVEIS SELECIONADOS PARA VOCÊ
        </p>
        {/* Switch Comprar / Alugar */}
        <div className="flex bg-[#e6e8f0] rounded-lg w-fit p-1">
          <button
            onClick={() => setModo("comprar")}
            className={`px-6 py-2 rounded-md font-semibold transition-all ${
              modo === "comprar"
                ? "bg-[#2c3d84] !text-white shadow"
                : "!text-[#30438380]"
            }`}
          >
            Comprar
          </button>
          <button
            onClick={() => setModo("alugar")}
            className={`px-6 py-2 rounded-md font-semibold transition-all ${
              modo === "alugar"
                ? "bg-[#2c3d84] !text-white shadow"
                : "!text-[#30438380]"
            }`}
          >
            Alugar
          </button>
        </div>
      </div>

      {/* Grade de imóveis */}
      <div className="propriedades-selecionadas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {imoveisFiltrados.map((imovel) => (
          <ImovelCard key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}