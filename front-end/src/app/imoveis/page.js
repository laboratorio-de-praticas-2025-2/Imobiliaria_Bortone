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
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  
  const { filterData } = useFilterData();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const handleGetImoveis = async (page = 1) => {
    try {
      const params = {};
      if (filterData && typeof filterData === "object") {
        Object.entries(filterData).forEach(([key, value]) => {
         
          if (['quartos', 'banheiros', 'vagas'].includes(key)) {
          if (value && typeof value === 'string') {
            params[key] = value;
          }
        } else if (key === 'citySearch') {
            params.citySearchTerm = value;
          } else if (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "null"
          ) {
            params[key] = value;
          }
        });
      }
      params.page = page.toString();

      const queryParams = new URLSearchParams(params).toString();

      const url = `${apiUrl}/imoveis${queryParams ? `?${queryParams}` : ""}`; 
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data)
      console.log("Fetching URL:", url);
      

      setImoveis(Array.isArray(data.entities) ? data.entities : []);
    
        // Handle pagination
      setPagination({
        totalCount: data.totalCount ?? 0,
        totalPages: data.totalPages ?? 0,
        currentPage: data.currentPage ?? 1,
        hasNextPage: data.hasNextPage ?? false,
        hasPrevPage: data.hasPrevPage ?? false,
      });

      
      setCurrentPage(page); // ✅ Save current page
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    }
  };

  useEffect(() => {
    handleGetImoveis(1);
  }, [filterData]);

  return <InnerImoveisPage 
  imoveis={imoveis}
  pagination = {pagination}
  onPageChange={(page) => handleGetImoveis(page)} 
  searchedCity={filterData.citySearch}
  />;
  
}


