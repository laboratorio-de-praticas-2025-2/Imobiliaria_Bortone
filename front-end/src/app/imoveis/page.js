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

  return (
    <FilterDataProvider>
      <ImoveisPageContent />
    </FilterDataProvider>
  );
}

function ImoveisPageContent() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { filterData } = useFilterData();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const itemsPerPage = 12;
  
  const handleGetImoveis = async (page = 1, append = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        ...filterData,
        page: page.toString(),
        limit: itemsPerPage.toString()
      });
      
      const url = `${apiUrl}/imoveis?${params.toString()}`; 
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      const result = await response.json();
      
      if (result.data && Array.isArray(result.data)) {
        if (append) {
          setImoveis(prev => [...prev, ...result.data]);
        } else {
          setImoveis(result.data);
        }
        setTotalCount(result.total || result.data.length);
      } else if (Array.isArray(result)) {
        // Fallback para APIs que retornam array direto
        if (append) {
          setImoveis(prev => [...prev, ...result]);
        } else {
          setImoveis(result);
        }
        setTotalCount(result.length);
      } else {
        setImoveis([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      setImoveis([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    handleGetImoveis(nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    setImoveis([]);
    handleGetImoveis(1, false);
  }, [filterData]);

  return (
    <InnerImoveisPage 
      imoveis={imoveis} 
      loading={loading}
      totalCount={totalCount}
      onLoadMore={loadMore}
      hasMore={imoveis.length < totalCount}
    />
  );
}


