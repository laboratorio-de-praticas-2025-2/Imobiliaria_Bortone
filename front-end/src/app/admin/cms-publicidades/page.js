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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPublicidades();
  }, []);

  // Filtrar publicidades baseado no termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPublicidades(publicidades);
    } else {
      const filtered = publicidades.filter(publicidade =>
        publicidade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publicidade.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublicidades(filtered);
    }
    setCurrentPage(1); // Reset para primeira página ao pesquisar
  }, [searchTerm, publicidades]);

  const loadPublicidades = async () => {
    try {
      const response = await axios.get("http://localhost:4000/publicidade");
      if (response.status === 200) {
        setPublicidades(response.data);
      }
    } catch {
      console.log("Erro ao carregar publicidades");
    }
  };

  // fatia os publicidades conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPublicidades = filteredPublicidades.slice(startIndex, endIndex);

  const onSearch = (value) => {
    setSearchTerm(value);
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
              filterData={{}}
              handleSelectOrder={() => {}}
              updateFilterData={() => {}}
            />
            <CMS.TableBody>
              {paginatedPublicidades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {paginatedPublicidades.map((publicidade) => (
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
                <p>No publicidades found.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={filteredPublicidades}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
