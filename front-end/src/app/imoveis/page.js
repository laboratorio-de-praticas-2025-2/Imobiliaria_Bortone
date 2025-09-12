"use client";
import { FilterDataProvider } from "@/context/FilterDataContext";
import { useFilterData } from "@/context/FilterDataContext";
import { mockImoveis } from "@/mock/imoveis";
import { useEffect, useState } from "react";
import InnerImoveisPage from "./InnerImoveisPage";

export default function ImoveisPage() {
  return (
    <FilterDataProvider>
      <ImoveisPageContent />
    </FilterDataProvider>
  );
}

function ImoveisPageContent() {
  const [imoveis, setImoveis] = useState([]);
  const { filterData } = useFilterData();

  const handleGetImoveis = async () => {
    try {
      const response = await fetch("http://localhost:4000/imoveis/busca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterData),
      });
      const data = await response.json();
      setImoveis(Array.isArray(data.propriedades) ? data.propriedades : []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    }
  };

  useEffect(() => {
    handleGetImoveis();
  }, [filterData]);

  return <InnerImoveisPage imoveis={imoveis} />;
}
