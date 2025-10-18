// app/admin/cms-banner/page.js - ATUALIZE A FUNÇÃO getImageUrl
"use client";

import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Normaliza valor ativo (0 ou 1)
const normalizeAtivo = (value) => {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value === 1 ? 1 : 0;
  if (typeof value === "string") return value === "1" || value.toLowerCase() === "true" ? 1 : 0;
  return 0;
};

// 🔥 FUNÇÃO getImageUrl CORRIGIDA - VERSÃO SIMPLIFICADA
const getImageUrl = (urlImagem) => {
  console.log("🖼️ Processando imagem:", urlImagem);
  
  if (!urlImagem || urlImagem === "null" || urlImagem === "undefined") {
    return "/images/casa.png";
  }
  
  // 🔥 CORREÇÃO: Para imagens no FRONT-END, use URL relativa
  // As imagens estão em front-end/public/uploads/banners/
  // Então a URL deve ser: /uploads/banners/nome-arquivo.jpg
  if (urlImagem.startsWith("/uploads/")) {
    return urlImagem; // Já está no formato correto
  }
  
  // Se for apenas o nome do arquivo, construa o caminho
  if (!urlImagem.startsWith("/") && !urlImagem.startsWith("http")) {
    return `/uploads/banners/${urlImagem}`;
  }
  
  // Para URLs completas (deixe como está)
  if (urlImagem.startsWith("http://") || urlImagem.startsWith("https://")) {
    return urlImagem;
  }
  
  return "/images/casa.png"; // Fallback
};

export default function CmsBannerPage() {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 8;
  
  const [filterData, setFilterData] = useState({ 
    order: null,
    search: ""
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  // Adicione este debug no fetchBanners
const fetchBanners = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const res = await fetch(`${BACKEND_BASE_URL}/banner`);
    
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    
    const data = await res.json();
    console.log("🔍 ESTRUTURA DOS BANNERS:", data);
    
    // 🔥 DEBUG DETALHADO - Mostra a estrutura de cada banner
    if (data && data.length > 0) {
      console.log("📋 PRIMEIRO BANNER (exemplo):", data[0]);
      console.log("🎯 CAMPOS DISPONÍVEIS:", Object.keys(data[0]));
    }
    
    const bannersProcessados = data.map(b => ({
      ...b,
      ativo: normalizeAtivo(b.ativo),
      imagem: getImageUrl(b.url_imagem || b.imagem),
    }));
    
    setBanners(bannersProcessados);
    
  } catch (err) {
    console.error("Erro ao buscar banners:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};;

  // ... resto das funções permanecem iguais

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/banner/${bannerId}`, { 
        method: "DELETE" 
      });
      if (!res.ok) throw new Error("Erro ao deletar banner");
      setBanners(prev => prev.filter(b => b.id !== bannerId));
    } catch (err) {
      alert(`Erro ao deletar banner: ${err.message}`);
    }
  };

  const handleToggleBanner = async (bannerId) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/banner/toggle/${bannerId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      const data = await res.json();
      setBanners(prev =>
        prev.map(b => b.id === bannerId ? { ...b, ativo: normalizeAtivo(data.ativo) } : b)
      );
    } catch (err) {
      alert("Erro ao alterar status do banner.");
    }
  };

  const onSearch = (value) => {
    setFilterData(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleSelectOrder = (value) => {
    console.log("🎯 Ordenação selecionada:", value);
    setFilterData(prev => ({ ...prev, order: value }));
    setCurrentPage(1);
  };

  const updateFilterData = (newData) => {
    setFilterData(prev => ({ ...prev, ...newData }));
    setCurrentPage(1);
  };

  // Funções de ordenação e filtro
  // Função de ordenação melhorada com logs
// Função de ordenação CORRIGIDA - usa "descricao" em vez de "titulo"
const sortBanners = (bannersToSort, order) => {
  if (!order || !bannersToSort?.length) return bannersToSort;
  
  console.log(`🔄 ORDENANDO por: ${order}`);
  console.log("📝 Primeiros 3 banners antes da ordenação:", 
    bannersToSort.slice(0, 3).map(b => ({ id: b.id, descricao: b.descricao }))
  );
  
  const sorted = [...bannersToSort].sort((a, b) => {
    // 🔥 CORREÇÃO: Usa "descricao" em vez de "titulo"
    const descricaoA = a.descricao || "";
    const descricaoB = b.descricao || "";
    
    console.log(`📚 Comparando "${descricaoA}" com "${descricaoB}"`);
    
    switch (order) {
      case "Alfabética A-Z":
        return descricaoA.localeCompare(descricaoB);
      case "Alfabética Z-A":
        return descricaoB.localeCompare(descricaoA);
      case "Mais recente":
        return (b.id || 0) - (a.id || 0);
      case "Mais antiga":
        return (a.id || 0) - (b.id || 0);
      default:
        return 0;
    }
  });
  
  console.log("✅ Primeiros 3 banners após ordenação:", 
    sorted.slice(0, 3).map(b => ({ id: b.id, descricao: b.descricao }))
  );
  
  return sorted;
};

const filterBanners = (bannersToFilter, search) => {
  if (!search || !bannersToFilter?.length) return bannersToFilter;
  
  return bannersToFilter.filter(banner => 
    (banner.descricao || "").toLowerCase().includes(search.toLowerCase())
  );
};

  // Processamento dos dados
  const filteredBanners = filterBanners(banners, filterData.search);
  const sortedBanners = sortBanners(filteredBanners, filterData.order);
  const paginatedBanners = sortedBanners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando banners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg mb-4">Erro: {error}</div>
        <button 
          onClick={fetchBanners}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Banners"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Novo Banner"
              buttonIcon={<FaImage />}
              onSearch={onSearch}
              href={"/admin/cms-banner/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
              orderOptions={[
                "Alfabética A-Z",
                "Alfabética Z-A", 
                "Mais recente",
                "Mais antiga"
              ]}
            />
            <CMS.TableBody>
              {paginatedBanners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
                  {paginatedBanners.map(banner => (
                    <Card
                      key={banner.id}
                      item={banner}
                      header
                      onDelete={() => handleDeleteBanner(banner.id)}
                      onToggle={() => handleToggleBanner(banner.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {banners.length === 0 
                      ? "Nenhum banner cadastrado." 
                      : "Nenhum banner encontrado para sua busca."}
                  </p>
                </div>
              )}
            </CMS.TableBody>
            {sortedBanners.length > pageSize && (
              <CMS.TableFooter
                postsData={sortedBanners}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}