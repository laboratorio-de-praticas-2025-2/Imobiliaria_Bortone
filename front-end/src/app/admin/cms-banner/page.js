"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState, useCallback } from "react";
import { FaImage } from "react-icons/fa6";
import axios from "axios";

export default function CmsBannerPage() {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filterData.order) {
      if (filterData.order === "Ordem alfabetica") {
        params.append('ordenarPor', 'alfabetica');
        params.append('direcao', 'ASC');
      } else if (filterData.order === "Data de inclusão") {
        params.append('ordenarPor', 'data');
        params.append('direcao', 'DESC');
      }
    }
    params.append('page', currentPage.toString());
    params.append('limit', '12');
    return params;
  }, [filterData.order, currentPage]);

  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = buildQueryParams();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/banner${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        if (response.data.data && response.data.pagination) {
          setBanners(response.data.data);
          setFilteredBanners(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setBanners(response.data);
          setFilteredBanners(response.data);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.length,
            totalPages: Math.ceil(response.data.length / prev.itemsPerPage)
          }));
        }
      }
    } catch (error) {
      console.log("Erro ao carregar banners:", error);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBanners(banners);
      if (banners.length > 0) {
        const isApiPaginated = pagination.totalItems > banners.length;
        if (!isApiPaginated) {
          setPagination(prev => ({
            ...prev,
            currentPage,
            totalItems: banners.length,
            totalPages: Math.ceil(banners.length / prev.itemsPerPage),
            hasNextPage: currentPage < Math.ceil(banners.length / prev.itemsPerPage),
            hasPreviousPage: currentPage > 1
          }));
        }
      } else {
        setPagination(prev => ({
          ...prev,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }));
      }
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = banners.filter(banner =>
        (banner.titulo || "").toLowerCase().includes(term) ||
        (banner.descricao || "").toLowerCase().includes(term)
      );
      setFilteredBanners(filtered);
      setCurrentPage(1);
      setPagination(prev => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / prev.itemsPerPage));
        return {
          ...prev,
          currentPage: 1,
          totalItems: filtered.length,
          totalPages,
          hasNextPage: totalPages > 1,
          hasPreviousPage: false
        };
      });
    }
  }, [searchTerm, banners, pagination.totalItems, currentPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadBanners();
    }
  }, [filterData.order, currentPage, searchTerm, loadBanners]);

  const onSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "" && searchTerm.trim() !== "") {
      setCurrentPage(1);
      loadBanners();
    } else if (value.trim() !== "") {
      setCurrentPage(1);
    }
  };

  const handleSelectOrder = (value) => {
    console.log("=== ORDENAÇÃO SELECIONADA ===");
    console.log("Valor selecionado:", value);
    console.log("filterData antes:", filterData);
    setFilterData((prev) => {
      const newFilterData = { ...prev, order: value };
      console.log("filterData depois:", newFilterData);
      return newFilterData;
    });
    setCurrentPage(1);
    console.log("=============================");
  };

  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
  };

  const handlePageChange = (newPage) => {
    console.log("Mudando para página:", newPage);
    setCurrentPage(newPage);
  };

  const getCurrentPageItems = () => {
    if (searchTerm.trim() !== "") {
      const startIndex = (currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return filteredBanners.slice(startIndex, endIndex);
    }
    return filteredBanners;
  };

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
              filterData={filterData}
              handleSelectOrder={handleSelectOrder}
              updateFilterData={updateFilterData}
            />
            <CMS.TableBody>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Carregando...</span>
                </div>
              ) : getCurrentPageItems().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {getCurrentPageItems().map((banner) => (
                    <Card
                      key={banner.id}
                      item={banner}
                      href_cms="banner"
                      header={false}
                      onDelete={loadBanners}
                      onToggle={loadBanners}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8">Nenhum banner encontrado.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={pagination}
              pageSize={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
