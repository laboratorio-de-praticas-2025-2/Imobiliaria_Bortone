"use client";
import { useFilters } from "@/context/FiltersContext";
import { Flex } from "antd";
import "dotenv/config";

export default function SettingsButtons({
  type,
  setImoveisMapa,
  setImoveisCarrossel,
}) {
  const { getFiltersForApi, removeFilters } = useFilters();

  const handleApply = async () => {
    // adicionar a requisição para a API aqui
    const filters = getFiltersForApi(type);
    console.log("Filtros aplicados:", filters);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/imoveis/mapa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters), // Envia os filtros para o backend
      });

      const data = await response.json();
      console.log(data);
      if (data) {
        // Atualiza a lista de imóveis com os dados retornados do backend
        setImoveisMapa(data.propriedades.mapa);
        setImoveisCarrossel(data.propriedades.carrossel);
        // Exemplo: setImoveis(data.propriedades);
      }
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  return (
    <div className="flex gap-3 pt-7 pb-6">
      {/* Botão Desfazer */}
      <button
        onClick={removeFilters}
        className=" w-full rounded-lg border-3 border-[#374A8C54] font-semibold bg-transparent hover:bg-[#1b2235] transition"
        style={{ color: "#767A8B " }}
      >
        Desfazer
      </button>

      {/* Botão Aplicar */}
      <button
        onClick={handleApply}
        className="w-full py-2 rounded-lg bg-[var(--secondary)] font-bold  hover:bg-[#d88500] transition"
        style={{ color: "white" }}
      >
        <Flex align="center" justify="center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Aplicar
        </Flex>
      </button>
    </div>
  );
}
