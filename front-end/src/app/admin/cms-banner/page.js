'use client';
import CMS from "@/components/cms";
import { FaImage } from "react-icons/fa6";

export default function cmsBannerPage() {
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
        </CMS.Table>
      </CMS.Body>
    );
}