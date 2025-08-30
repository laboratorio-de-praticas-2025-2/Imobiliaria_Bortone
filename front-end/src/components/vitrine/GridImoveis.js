import { useState, useEffect } from "react";
import ImovelCard from "./ImovelCard";
import { mockImoveis } from "@/constants/imoveis";
import GridImoveisFooter from "./GridImoveisFooter";

export default function GridImoveis() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 640) setItemsPerPage(4);
    else if (windowWidth < 768) setItemsPerPage(6);
    else if (windowWidth < 1024) setItemsPerPage(9);
    else setItemsPerPage(12);

    setCurrentPage(1);
  }, [windowWidth]);

  const totalPages = Math.ceil(mockImoveis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = mockImoveis.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const showMoreMobile = () => {
    setItemsPerPage((prev) => Math.min(prev + 4, mockImoveis.length));
  };

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentItems.map((imovel, index) => (
          <ImovelCard key={index} imovel={imovel} />
        ))}
      </div>

      {/* Footer */}
      <GridImoveisFooter
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrev={handlePrev}
        handleNext={handleNext}
        windowWidth={windowWidth}
        showMoreMobile={
          windowWidth < 640 && currentItems.length < mockImoveis.length
            ? showMoreMobile
            : null
        }
      />
    </div>
  );
}
