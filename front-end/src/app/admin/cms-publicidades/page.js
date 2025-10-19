"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState, useCallback, useMemo } from "react";
import { RiStickyNoteAddLine } from "react-icons/ri";
import axios from "axios";
import { PiWarningCircleBold } from "react-icons/pi";

export default function CmsPublicidadePage() {
  const [publicidades, setPublicidades] = useState([]);
  const [filteredPublicidades, setFilteredPublicidades] = useState([]);
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

  const loadPublicidades = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filterData.order) {
        if (filterData.order === "Ordem alfabetica") {
          params.append("ordenarPor", "alfabetica");
          params.append("direcao", "ASC");
        } else if (filterData.order === "Data de inclusão") {
          params.append("ordenarPor", "data");
          params.append("direcao", "DESC");
        }
      }

      params.append("page", String(currentPage));
      params.append("limit", String(pagination.itemsPerPage));

      console.log('🔍 Carregando publicidades com parâmetros:', params.toString());

      const url = `${process.env.NEXT_PUBLIC_API_URL}/publicidade${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        // Garantir que sempre temos um array
        let publicidadesData = [];

        if (response.data.data && response.data.pagination) {
          publicidadesData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setPublicidades(publicidadesData);
          setFilteredPublicidades(publicidadesData);
          setPagination(response.data.pagination);
        } else {
          publicidadesData = Array.isArray(response.data) ? response.data : [];
          setPublicidades(publicidadesData);
          setFilteredPublicidades(publicidadesData);
          setPagination((prev) => ({
            ...prev,
            totalItems: publicidadesData.length,
            totalPages: Math.ceil(publicidadesData.length / prev.itemsPerPage),
          }));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar publicidades:", error);
      setPublicidades([]);
      setFilteredPublicidades([]);
      setPagination((prev) => ({
        ...prev,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [filterData.order, currentPage, pagination.itemsPerPage]);

  // Função para deletar uma publicidade específica
  const deletePublicidade = useCallback(async (id) => {
    try {
      console.log('🗑️ Deletando publicidade:', id);
      const authToken = localStorage.getItem('authToken');
      
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/publicidade/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Publicidade deletada com sucesso');
      await loadPublicidades(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar publicidade:', error);
      throw error;
    }
  }, [loadPublicidades]);

  // Função para alternar status ativo/inativo
  const togglePublicidade = useCallback(async (id, currentStatus) => {
    try {
      console.log('🔄 Alternando status da publicidade:', id, 'Status atual:', currentStatus);
      const authToken = localStorage.getItem('authToken');
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/publicidade/${id}`,
        {
          ativo: !currentStatus
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Status alterado com sucesso');
      await loadPublicidades(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('❌ Erro ao alterar status da publicidade:', error);
      throw error;
    }
  }, [loadPublicidades]);

  useEffect(() => {
    loadPublicidades();
  }, [loadPublicidades]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPublicidades(publicidades);
      if (publicidades.length > 0) {
        const isApiPaginated = pagination.totalItems > publicidades.length;
        if (!isApiPaginated) {
          setPagination((prev) => ({
            ...prev,
            currentPage,
            totalItems: publicidades.length,
            totalPages: Math.ceil(publicidades.length / prev.itemsPerPage),
            hasNextPage:
              currentPage < Math.ceil(publicidades.length / prev.itemsPerPage),
            hasPreviousPage: currentPage > 1,
          }));
        }
      } else {
        setPagination((prev) => ({
          ...prev,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }));
      }
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = publicidades.filter(
        (publicidade) =>
          (publicidade.titulo || "").toLowerCase().includes(term) ||
          (publicidade.conteudo || "").toLowerCase().includes(term)
      );
      setFilteredPublicidades(filtered);
      setCurrentPage(1);
      setPagination((prev) => {
        const totalPages = Math.max(
          1,
          Math.ceil(filtered.length / prev.itemsPerPage)
        );
        return {
          ...prev,
          currentPage: 1,
          totalItems: filtered.length,
          totalPages,
          hasNextPage: totalPages > 1,
          hasPreviousPage: false,
        };
      });
    }
  }, [searchTerm, publicidades, pagination.totalItems, currentPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadPublicidades();
    }
  }, [filterData.order, currentPage, searchTerm, loadPublicidades]);

  // removida versão antiga de loadPublicidades substituída por useCallback

  const onSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "" && searchTerm.trim() !== "") {
      setCurrentPage(1);
      loadPublicidades();
    } else if (value.trim() !== "") {
      setCurrentPage(1);
    }
  };

  const handleSelectOrder = (value) => {
    setFilterData((prev) => {
      const newFilterData = { ...prev, order: value };
      return newFilterData;
    });
    setCurrentPage(1);
  };

  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Paginação e ordenação client-side dos dados filtrados
  let orderedPublicidades = [...filteredPublicidades];
  
  if (filterData.order) {
    if (filterData.order === "Ordem alfabetica") {
      orderedPublicidades = orderedPublicidades.sort((a, b) => 
        (a.titulo || "").localeCompare(b.titulo || "")
      );
    } else if (filterData.order === "Data de inclusão") {
      orderedPublicidades = orderedPublicidades.sort(
        (a, b) => new Date(b.data_criacao || 0) - new Date(a.data_criacao || 0)
      );
    }
  }

  const startIndex = (currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedPublicidades = orderedPublicidades.slice(startIndex, endIndex);

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Publicidades"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Nova Publicidade"
              buttonIcon={<RiStickyNoteAddLine />}
              onSearch={onSearch}
              href={"/admin/cms-publicidades/criar"}
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
              ) : paginatedPublicidades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {paginatedPublicidades.map((publicidade) => (
                    <Card
                      key={publicidade.id}
                      item={publicidade}
                      href_cms="publicidades"
                      header={true}
                      onDelete={() => deletePublicidade(publicidade.id)}
                      onToggle={() => togglePublicidade(publicidade.id, publicidade.ativo === 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full flex justify-center h-[500px] items-center">
                  <div className="rounded-2xl bg-white shadow-2xl p-10 flex flex-col gap-5">
                    <div className="flex flex-row gap-5 items-center">
                      <PiWarningCircleBold
                        size={50}
                        className="text-[var(--primary)]"
                      />
                      <div className="flex flex-col gap-2">
                        <span className="text-4xl font-bold text-[var(--primary)]">
                          Atenção
                        </span>
                        <p className="max-w-[200px]">
                          Não foi possível exibir os dados devido à falta de
                          existência do mesmo.
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-[var(--primary)] !text-white font-bold py-2 px-4 rounded !text-xl"
                      onClick={() => window.location.reload()}
                    >
                      Recarregar
                    </button>
                  </div>
                </div>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              totalItems={orderedPublicidades.length}
              pageSize={pagination.itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
