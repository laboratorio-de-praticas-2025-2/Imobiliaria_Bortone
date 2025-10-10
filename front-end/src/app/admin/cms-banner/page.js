"use client";

import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { buildImageUrl } from "@/utils/imageUtils";
import SplashScreen from "@/components/SplashScreen";
import { apiClient } from "@/utils/apiClient";

// Normaliza valor ativo (0 ou 1)
const normalizeAtivo = (value) => {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value === 1 ? 1 : 0;
  if (typeof value === "string") return value === "1" || value.toLowerCase() === "true" ? 1 : 0;
  return 0;
};

// Usar utilitário unificado para construir URL da imagem
const getImageUrl = (urlImagem) => {
  return buildImageUrl(urlImagem, 'banner', '/images/casa.png');
};

// Chama backend para alternar status do banner
const toggleStatus = async (id) => {
  try {
    const response = await apiClient.put(`/banner/toggle/${id}`);
    return response.data;
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
      const response = await apiClient.get("/banner");
      const data = response.data;
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
      await apiClient.delete(`/banner/${bannerId}`);
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

  if (loading) return <SplashScreen />;

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
                  {paginatedBanners.map(banner => (
                    <div key={banner.id} className="relative">
                      <Card
                        item={banner}
                        header
                        onDelete={() => handleDeleteBanner(banner.id)}
                        onToggle={() => handleToggleBanner(banner.id)}
                      />
                 
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Nenhum banner encontrado.</p>
                  <p className="text-gray-400 text-sm mt-2">Clique em "Novo Banner" para criar seu primeiro banner.</p>
                </div>
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
