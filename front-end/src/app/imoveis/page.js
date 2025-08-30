"use client";
import { FilterDataProvider } from "@/context/FilterDataContext";
import { useEffect, useState } from "react";
import InnerImoveisPage from "./InnerImoveisPage";

export default function ImoveisPage() {
  const [qtdImoveis, setQtdImoveis] = useState(0);

  const handleGetImoveis = () => {
    // Lógica para buscar imóveis com base nos filtros aplicados
    // Atualize a quantidade de imóveis encontrados
    setQtdImoveis(42); // Exemplo: atualiza com um valor fictício
  };

  useEffect(() => {
    handleGetImoveis();
  }, []);

  return (
    <FilterDataProvider>
      <InnerImoveisPage qtdImoveis={qtdImoveis} />
    </FilterDataProvider>
  );
}