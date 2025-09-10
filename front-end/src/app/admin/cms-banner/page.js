"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { bannersMock } from "@/mock/banner";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";

export default function CmsBannerPage() {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [filterData, setFilterData] = useState({ order: null });

  useEffect(() => {
    setBanners(bannersMock);
  }, []);

  // fatia os banners conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBanners = banners.slice(startIndex, endIndex);

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
                  {paginatedBanners.map((banner) => (
                    <Card key={banner.id} item={banner} />
                  ))}
                </div>
              ) : (
                <p>No banners found.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
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
