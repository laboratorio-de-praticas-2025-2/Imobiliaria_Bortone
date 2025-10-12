"use client";
import PostCard from "@/components/cms/PostCard";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import axios from "axios";
import { PiWarningCircleBold } from "react-icons/pi";

export default function CmsBlogPage() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [filteredPublicacoes, setFilteredPublicacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({ order: null });
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

  // Função centralizada para tratamento de erros
  const handleError = (error, context) => {
    console.error(`Erro ${context}:`, error);
    if (error.response) {
      console.error("❌ Resposta do servidor:", error.response.status);
      console.error("Dados da resposta:", error.response.data);
    } else if (error.request) {
      console.error("❌ Requisição enviada mas sem resposta:", error.request);
    } else {
      console.error("❌ Erro ao configurar a requisição:", error.message);
    }
  };

  console.log(
    "CmsBlogPage carregado, currentPage:",
    currentPage,
    "filterData:",
    filterData
  );

  useEffect(() => {
    console.log("useEffect chamando loadPublicacoes");
    loadPublicacoes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPublicacoes(publicacoes);
    } else {
      const filtered = publicacoes.filter(
        (pub) =>
          pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublicacoes(filtered);
      setCurrentPage(1);
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
        hasNextPage: Math.ceil(filtered.length / prev.itemsPerPage) > 1,
        hasPreviousPage: false,
      }));
    }
  }, [searchTerm, publicacoes]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Aplica filtros nos dados já carregados
      let filtered = [...publicacoes];

      if (filterData.order) {
        if (filterData.order === "Ordem alfabetica") {
          filtered = filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (filterData.order === "Data de publicação") {
          filtered = filtered.sort(
            (a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao)
          );
        }
      }

      setFilteredPublicacoes(filtered);
      setPagination((prev) => ({
        ...prev,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
      }));
    }
  }, [filterData.order, publicacoes]);

  const loadPublicacoes = async () => {
    try {
      setIsLoading(true);

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");

      const params = new URLSearchParams();

      if (filterData.order) {
        if (filterData.order === "Ordem alfabetica") {
          params.append("ordenarPor", "alfabetica");
          params.append("direcao", "ASC");
        } else if (filterData.order === "Data de publicação") {
          params.append("ordenarPor", "data");
          params.append("direcao", "DESC");
        }
      }

      // Busca todos os registros - usa parâmetros padrão do backend
      params.append("page", "1");
      params.append("limit", "1000"); // Limite alto para pegar todos

      // Endpoint correto no backend: /publicacoes
      const endpoint = "publicacoes";
      const fullUrl = `${apiUrl}/${endpoint}${
        params.toString() ? "?" + params.toString() : ""
      }`;

      // Debug completo
      console.log("=== DEBUG LOAD PUBLICACOES ===");
      console.log("Variável de ambiente NEXT_PUBLIC_API_URL:", apiUrl);
      console.log("Endpoint usado:", endpoint);
      console.log("URL completa:", fullUrl);
      console.log("Parâmetros:", Object.fromEntries(params));
      console.log("==============================");

      const response = await axios.get(fullUrl);

      console.log("Status da resposta:", response.status);
      console.log("Dados recebidos:", response.data);

      if (response.status === 200) {
        // Verifica se a resposta tem estrutura de paginação ou é array direto
        let data = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        setPublicacoes(data);
        setFilteredPublicacoes(data);
        setPagination((prev) => ({
          ...prev,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / prev.itemsPerPage),
        }));
      }
    } catch (error) {
      handleError(error, "ao carregar publicações");
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "" && searchTerm.trim() !== "") {
      setCurrentPage(1);
      loadPublicacoes();
    }
  };

  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({ ...prev, order: value }));
    setCurrentPage(1);
  };

  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredPublicacoes.slice(startIndex, endIndex);
  };

  const deletePost = async (id) => {
    if (!confirm("Deseja realmente excluir este artigo?")) return;
    try {
      setIsLoading(true);
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
      await axios.delete(`${apiUrl}/publicacoes/${id}`);
      loadPublicacoes();
    } catch (error) {
      handleError(error, "ao deletar artigo");
      alert("Não foi possível excluir o artigo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Publicações"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Nova Publicação"
              buttonIcon={<VscNewFile />}
              onSearch={onSearch}
              href={"/admin/cms-publicacoes/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
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
                  {getCurrentPageItems().map((post) => (
                    <PostCard
                      key={post.id}
                      item={post}
                      onDelete={() => deletePost(post.id)}
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

            <CMS.TableFooter
              postsData={filteredPublicacoes}
              pageSize={pagination.itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pagination={pagination}
              isLoading={isLoading}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
