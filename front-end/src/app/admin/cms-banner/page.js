'use client';
import { useEffect, useState } from "react";
import CMS from "@/components/cms";
import { FaImage } from "react-icons/fa6";
import Card from "@/components/cms/Card";
import { bannersMock } from "@/constants/banner";

export default function CmsBannerPage() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        // Fetch banners from API or database
        setBanners(bannersMock);
    }, []);

    const onSearch = (value) => {
        console.log("Search:", value);
    };
    const onClickNew = () => {
        console.log("New Banner");
    }
    const handleSelectOrder = (value) => {
        console.log("Selected order:", value);
    }
    const filterData = {};

    const updateFilterData = (newData) => {
        console.log("Update filter data:", newData);
    }

    return (
      <CMS.Body title={"Banners"}>
        <CMS.Table>
          <CMS.TableHeader buttonText={'Novo Banner'} buttonIcon={<FaImage />} onSearch={onSearch} onClickNew={onClickNew} handleSelectOrder={handleSelectOrder} filterData={filterData} updateFilterData={updateFilterData} />
          <CMS.TableBody>
            {banners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {banners.map((banner) => (
                  <Card key={banner.id} banner={banner} />
                ))}
              </div>
            ) : (
              <p>No banners found.</p>
            )}
          </CMS.TableBody>
        </CMS.Table>
      </CMS.Body>
    );
}