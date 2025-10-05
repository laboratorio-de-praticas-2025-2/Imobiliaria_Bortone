"use client";

import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";

// URL base do backend
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Normaliza valor ativo (0 ou 1)
const normalizeAtivo = (value) => {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value === 1 ? 1 : 0;
  if (typeof value === "string") return value === "1" || value.toLowerCase() === "true" ? 1 : 0;
  return 0;
};

// Constrói URL da imagem
const getImageUrl = (urlImagem) => {
  if (!urlImagem) return "/images/casa.png";
  
  // URLs absolutas (http/https) - retorna diretamente
  if (urlImagem.startsWith("http://") || urlImagem.startsWith("https://")) {
    return urlImagem;
  }
  
  // URLs que começam com / - adiciona base URL
  if (urlImagem.startsWith("/")) {
    return `${BACKEND_BASE_URL}${urlImagem}`;
  }
  
  // URLs relativas - assume pasta uploads/banners
  return `${BACKEND_BASE_URL}/uploads/banners/${urlImagem}`;
};

// Chama backend para alternar status do banner
const toggleStatus = async (id) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/banner/toggle/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Erro ao atualizar status no servidor.");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao alterar status no backend:", error);
    throw error;
  }
};

export default function CmsBannerPage() {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 8;
  const [filterData, setFilterData] = useState({ order: null });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_BASE_URL}/banner`);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const bannersProcessados = data.map(b => ({
        ...b,
        ativo: normalizeAtivo(b.ativo),
        imagem: getImageUrl(b.url_imagem),
      }));
      setBanners(bannersProcessados);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/banner/${bannerId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(errorData.message);
      }
      setBanners(prev => prev.filter(b => b.id !== bannerId));
    } catch (err) {
      console.error(err);
      alert(`Erro ao deletar banner: ${err.message}`);
      throw err;
    }
  };

  const handleToggleBanner = async (bannerId) => {
    try {
      const data = await toggleStatus(bannerId);
      setBanners(prev =>
        prev.map(b => (b.id === bannerId ? { ...b, ativo: normalizeAtivo(data.ativo) } : b))
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status do banner.");
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBanners = banners.slice(startIndex, endIndex);

  const onSearch = (value) => console.log("Search:", value);
  const handleSelectOrder = (value) => setFilterData(prev => ({ ...prev, order: value }));
  const updateFilterData = (newData) => setFilterData(prev => ({ ...prev, ...newData }));
  const handleRetry = () => fetchBanners();

  if (loading) return <div>Carregando banners...</div>;
  if (error)
    return (
      <div>
        Erro: {error} <button onClick={handleRetry}>Tentar Novamente</button>
      </div>
    );

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
            />
            <CMS.TableBody>
              {paginatedBanners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {paginatedBanners.map(banner => (
                    <Card
                      key={banner.id}
                      item={banner}
                      header
                      onDelete={() => handleDeleteBanner(banner.id)}
                      onToggle={() => handleToggleBanner(banner.id)} // ✅ toggle funcional
                    />
                  ))}
                </div>
              ) : (
                <p>Nenhum banner encontrado.</p>
              )}
            </CMS.TableBody>
            <CMS.TableFooter
              postsData={banners}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
