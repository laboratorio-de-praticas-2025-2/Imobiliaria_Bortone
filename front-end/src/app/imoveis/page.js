"use client";
import { FilterDataProvider } from "@/context/FilterDataContext";
import { mockImoveis } from "@/mock/imoveis";
import { useEffect, useState } from "react";
import InnerImoveisPage from "./InnerImoveisPage";

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState([]);

  const handleGetImoveis = async () => {
    // Chamada à API para buscar os imóveis
    setImoveis(mockImoveis); // Substitua mockImoveis pela resposta da API
  };

  // EXEMPLO PARA A REQUISIÇÃO DE IMÓVEIS ENVIANDO PAGINA E ITENS POR PÁGINA
  // const fetchImoveis = async (page, itemsPerPage) => {
  //   try {
  //     const data = await getImoveis(page, itemsPerPage);
  //     setImoveis(data);
  //   } catch (error) {
  //     console.error("Erro ao carregar imóveis:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchImoveis(currentPage, itemsPerPage);
  // }, [currentPage, itemsPerPage]);

  useEffect(() => {
    handleGetImoveis();
  }, []);

  return (
    <FilterDataProvider>
      <InnerImoveisPage imoveis={imoveis} />
    </FilterDataProvider>
  );
}
