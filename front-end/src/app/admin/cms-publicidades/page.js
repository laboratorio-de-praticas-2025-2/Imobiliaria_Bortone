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
  
  // Estados para paginação
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
    // Carregar dados iniciais apenas uma vez
    loadPublicidades();
  }, []);

  // Filtrar publicidades baseado no termo de pesquisa (agora funciona com paginação)
  // Filtrar publicidades baseado no termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Se não há termo de busca, usar os dados originais da API
      setFilteredPublicidades(publicidades);
      // Restaurar paginação original se havia busca antes
      if (publicidades.length > 0) {
        // Se temos dados paginados da API, manter a paginação da API
        // Caso contrário, calcular paginação local
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
      // Se há termo de busca, filtrar localmente
      const filtered = publicidades.filter(publicidade =>
        publicidade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publicidade.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublicidades(filtered);
      setCurrentPage(1);
      // Atualizar paginação para busca local
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

  // Recarregar dados quando a ordenação ou página mudar (apenas se não há busca ativa)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadPublicidades();
    }
  }, [filterData.order, currentPage]);

  const loadPublicidades = async () => {
    try {
      setIsLoading(true);
      // Construir parâmetros de query baseado no filtro atual
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

      // Adicionar parâmetros de paginação
      params.append('page', currentPage.toString());
      params.append('limit', '12'); // 12 itens por página

      const url = `http://localhost:4000/publicidade${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fazendo requisição para:', url);

      const response = await axios.get(url);
      if (response.status === 200) {
        console.log('Dados recebidos:', response.data);
        
        // Verificar se a resposta tem o formato de paginação
        if (response.data.data && response.data.pagination) {
          // Formato com paginação
          setPublicidades(response.data.data);
          setFilteredPublicidades(response.data.data);
          setPagination(response.data.pagination);
          console.log('Paginação recebida:', response.data.pagination);
        } else {
          // Formato antigo (sem paginação) - fallback
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
    // Se o usuário limpou a busca, recarregar dados da API
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
    // Resetar para página 1 quando mudar ordenação
    setCurrentPage(1);
    console.log('=============================');
  };

  const updateFilterData = (newData) => {
    setFilterData(prev => ({ ...prev, ...newData }));
  };

  // Função para lidar com mudança de página
  const handlePageChange = (newPage) => {
    console.log('Mudando para página:', newPage);
    setCurrentPage(newPage);
  };

  // Função para obter os itens da página atual (para busca local)
  const getCurrentPageItems = () => {
    if (searchTerm.trim() !== "") {
      // Para busca local, paginar os resultados filtrados
      const startIndex = (currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return filteredPublicidades.slice(startIndex, endIndex);
    }
    // Para busca da API, retornar todos os itens (já vêm paginados)
    return filteredPublicidades;
  };

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
            <CMS.TableFooter
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