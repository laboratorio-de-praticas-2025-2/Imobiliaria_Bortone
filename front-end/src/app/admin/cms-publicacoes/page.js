"use client";
import PostCard from "@/components/cms/PostCard";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { useEffect, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { getAllArtigos } from "@/services/blogService";

export default function CmsBannerPage() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [filterData, setFilterData] = useState({ order: null });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllArtigos();
        setPublicacoes(response.artigos);
      } catch (err) {
        console.error("Erro ao carregar artigos:", err);
      }
    }
    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPublicacoes = publicacoes.slice(startIndex, endIndex);

  const onSearch = (value) => console.log("Search:", value);
  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({ ...prev, order: value }));
    console.log("Selected order:", value);
  };
  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
    console.log("Update filter data:", newData);
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Publicações"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Nova Publicação"
              buttonIcon={<VscNewFile fontWeight={"bold"} />}
              onSearch={onSearch}
              href={"/admin/cms-publicacoes/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
            />
            <CMS.TableBody>
              {paginatedPublicacoes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {paginatedPublicacoes.map((post) => (
                    <PostCard key={post.id} item={post} />
                  ))}
                </div>
              ) : (
                <p>Nenhuma publicação encontrada.</p>
              )}
            </CMS.TableBody>

            <CMS.TableFooter
              postsData={publicacoes}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}