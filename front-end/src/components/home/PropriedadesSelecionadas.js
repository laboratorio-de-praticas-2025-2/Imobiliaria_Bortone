import ImovelCard from "@/components/home/ImovelCard";
import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";

export default function PropriedadesSelecionadas() {
  const [imoveis, setImoveis] = useState([]);
  const [modo, setModo] = useState("comprar");

  const imoveisFiltrados = imoveis.filter((imovel) =>
    modo === "comprar" ? 
      (imovel.tipo === "comprar" || imovel.tipo_negociacao === "venda") : 
      (imovel.tipo === "alugar" || imovel.tipo_negociacao === "aluguel")
  );

  useEffect(() => {
    let isMounted = true;
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const fetchRecomendacoes = async () => {
      try {
        console.log("🏠 Buscando recomendações do Render...");
        const params = userInfo ? { usuario_id: userInfo.id } : { limit: 20 };

        const res = await apiClient.get("/recomendacoes", { params });

        console.log("📊 Recomendações recebidas:", res.data.data?.length || 0);
        setImoveis(res.data.data || []);
      } catch (err) {
        console.error("❌ Erro detalhado ao buscar recomendações:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url,
          method: err.config?.method
        });
        if (isMounted) {
          setImoveis([]);
        }
      }
    };

    fetchRecomendacoes();
    
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    console.log("Imóveis recomendados:", imoveis);
  }, [imoveis]);

  return (
    <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
      <div className="flex md:flex-row flex-col justify-between">
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