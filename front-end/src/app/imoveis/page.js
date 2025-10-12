"use client";
import { FilterDataProvider } from "@/context/FilterDataContext";
import { useFilterData } from "@/context/FilterDataContext";
import { useEffect, useState, useCallback } from "react";
import InnerImoveisPage from "./InnerImoveisPage";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
// import "dotenv/config";

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
  const [loading, setLoading] = useState(false); // missing
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
  const itemsPerPage = 12;
  


  // Function to normalize data before sending to API
  const normalizeForAPI = (data) => {
    if (typeof data === 'string') {
      // Remove accents from status values
      return data
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    return data;
  };
  
  const handleGetImoveis = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      
      const params = {};
      if (filterData && typeof filterData === "object") {
        Object.entries(filterData).forEach(([key, value]) => {
         
          if (['quartos', 'banheiros', 'vagas'].includes(key)) {
          if (value && typeof value === 'string') {
            // Keep the + values as strings for proper backend handling
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
            // Normalize status field to remove accents
            if (key === 'status') {
              params[key] = normalizeForAPI(value);
            } else {
              params[key] = value;
            }
          }
        });
      }
      params.page = page.toString();

      
      
      const query = new URLSearchParams({
        //Paginação: padrão alterado de 10 pra 12
        pagination: "12", 
        ...params,        
      });
      const url = `${apiUrl}/imoveis?${query.toString()}`;
      
      console.log("Frontend - Final params being sent:", params);
      console.log("Frontend - URL being called:", url);

      
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


      
      setCurrentPage(page); 

    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      setImoveis([]);
      setPagination({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [filterData, apiUrl]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    handleGetImoveis(nextPage);
  };

  useEffect(() => {
    handleGetImoveis(1);
  }, [handleGetImoveis]);

  return <InnerImoveisPage 
  imoveis={imoveis}
  pagination = {pagination}
  loading = {loading}
  onPageChange={(page) => handleGetImoveis(page)} 
  searchedCity={filterData.citySearch}
  />;
  

}
