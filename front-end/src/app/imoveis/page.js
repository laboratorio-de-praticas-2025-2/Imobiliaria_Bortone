"use client";
import { FilterDataProvider } from "@/context/FilterDataContext";
import { useFilterData } from "@/context/FilterDataContext";
import { useEffect, useState } from "react";
import InnerImoveisPage from "./InnerImoveisPage";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import "dotenv/config";

export default function ImoveisPage() {
  // SEO para página de imóveis
  useSEO(getSEOConfig("/imoveis"));
  const [imoveis, setImoveis] = useState([]);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/imoveis/busca`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
