"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { publicidadesMock } from "@/mock/publicidades";
import { useEffect, useState } from "react";
import { RiStickyNoteAddLine } from "react-icons/ri";

export default function CmsPublicidadePage() {
  const [publicidades, setPublicidades] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [filterData, setFilterData] = useState({ order: null });

  useEffect(() => {
    setPublicidades(publicidadesMock);
  }, []);

  // fatia os publicidades conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPublicidades = publicidades.slice(startIndex, endIndex);

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
        <CMS.Body title={"Publicidades"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Nova Publicidade"
              buttonIcon={<RiStickyNoteAddLine />}
              onSearch={onSearch}
              href={"/admin/cms-publicidades/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
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
                    />
                  ))}
                </div>
              ) : (
                <p>No publicidades found.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={publicidades}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
