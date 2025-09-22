"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { RiStickyNoteAddLine } from "react-icons/ri";
import axios from "axios";

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
    hasPreviousPage: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPublicidades();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPublicidades(publicidades);
      if (publicidades.length > 0) {
        const isApiPaginated = pagination.totalItems > publicidades.length;
        if (!isApiPaginated) {
          setPagination(prev => ({
            ...prev,
            currentPage: currentPage,
            totalItems: publicidades.length,
            totalPages: Math.ceil(publicidades.length / prev.itemsPerPage),
            hasNextPage: currentPage < Math.ceil(publicidades.length / prev.itemsPerPage),
            hasPreviousPage: currentPage > 1
          }));
        }
      }
    } else {
      const filtered = publicidades.filter(publicidade =>
        publicidade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publicidade.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublicidades(filtered);
      setCurrentPage(1);
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
        hasNextPage: Math.ceil(filtered.length / prev.itemsPerPage) > 1,
        hasPreviousPage: false
      }));
    }
  }, [searchTerm, publicidades, currentPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadPublicidades();
    }
  }, [filterData.order, currentPage]);

  const loadPublicidades = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      console.log('filterData.order atual:', filterData.order);

      if (filterData.order) {
        if (filterData.order === "Ordem alfabetica") {
          params.append('ordenarPor', 'alfabetica');
          params.append('direcao', 'ASC');
          console.log('Aplicando ordenação alfabética ASC');
        } else if (filterData.order === "Data de inclusão") {
          params.append('ordenarPor', 'data');
          params.append('direcao', 'DESC');
          console.log('Aplicando ordenação por data DESC');
        }
      } else {
        console.log('Nenhuma ordenação específica, usando padrão');
      }

      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const url = `${process.env.NEXT_PUBLIC_API_URL}/publicidade${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fazendo requisição para:', url);

      const response = await axios.get(url);
      if (response.status === 200) {
        console.log('Dados recebidos:', response.data);
        
        if (response.data.data && response.data.pagination) {
          setPublicidades(response.data.data);
          setFilteredPublicidades(response.data.data);
          setPagination(response.data.pagination);
          console.log('Paginação recebida:', response.data.pagination);
        } else {
          setPublicidades(response.data);
          setFilteredPublicidades(response.data);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.length,
            totalPages: Math.ceil(response.data.length / prev.itemsPerPage)
          }));
        }
      }
    } catch (error) {
      console.log("Erro ao carregar publicidades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "" && searchTerm.trim() !== "") {
      setCurrentPage(1);
      loadPublicidades();
    }
  };

  const handleSelectOrder = (value) => {
    console.log('=== ORDENAÇÃO SELECIONADA ===');
    console.log('Valor selecionado:', value);
    console.log('filterData antes:', filterData);
    setFilterData(prev => {
      const newFilterData = { ...prev, order: value };
      console.log('filterData depois:', newFilterData);
      return newFilterData;
    });
    setCurrentPage(1);
    console.log('=============================');
  };

  const updateFilterData = (newData) => {
    setFilterData(prev => ({ ...prev, ...newData }));
  };

  const handlePageChange = (newPage) => {
    console.log('Mudando para página:', newPage);
    setCurrentPage(newPage);
  };

  const getCurrentPageItems = () => {
    if (searchTerm.trim() !== "") {
      const startIndex = (currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return filteredPublicidades.slice(startIndex, endIndex);
    }
    return filteredPublicidades;
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Publicidades"}>
          <CMS.Table>
            <CMS.TableHeaderPublicidade
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
              ) : getCurrentPageItems().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {getCurrentPageItems().map((publicidade) => (
                    <Card
                      key={publicidade.id}
                      item={publicidade}
                      href_cms="publicidades"
                      header={true}
                      onDelete={loadPublicidades}
                      onToggle={loadPublicidades}
                    />
                  ))}
                </div>
              ) : (
                <p>Nenhuma publicidade encontrada.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooterPublicidade
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}