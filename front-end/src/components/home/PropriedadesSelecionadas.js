import ImovelCard from "@/components/home/ImovelCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropriedadesSelecionadas() {
  const [imoveis, setImoveis] = useState([]);

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
      <p className="lemon-milk md:text-3xl text-xl text-[var(--primary)]">
        IMÓVEIS SELECIONADOS PARA VOCÊ
      </p>
      <div className="propriedades-selecionadas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {imoveis.map((imovel) => (
          <ImovelCard key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}