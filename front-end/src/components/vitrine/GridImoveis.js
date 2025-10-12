import { useState, useEffect } from "react";
import ImovelCard from "./ImovelCard";
import Link from "next/link";
import GridImoveisFooter from "./GridImoveisFooter";

export default function GridImoveis({ imoveis, pagination, onPageChange }) {
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

  // Determine if using server-side pagination
  const isServerPaginated = !!pagination;

  const effectivePage = isServerPaginated ? pagination.currentPage : currentPage;
  const totalPages = isServerPaginated
    ? pagination.totalPages
    : Math.ceil(imoveis.length / itemsPerPage);

  const startIndex = (effectivePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = isServerPaginated ? imoveis : imoveis.slice(startIndex, endIndex);

  const handlePrev = () => {
    const newPage = Math.max(effectivePage - 1, 1);
    isServerPaginated ? onPageChange?.(newPage) : setCurrentPage(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(effectivePage + 1, totalPages);
    isServerPaginated ? onPageChange?.(newPage) : setCurrentPage(newPage);
  };

  const showMoreMobile = () => {
    setItemsPerPage((prev) => Math.min(prev + 4, imoveis.length));
  };

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentItems.map((imovel, index) => (
          <div key={`${imovel.id}-${index}`}>
            <Link href="/imoveis/[id]" as={`/imoveis/${imovel.id}`}>
              <ImovelCard imovel={imovel} />
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <GridImoveisFooter
        currentPage={effectivePage}
        totalPages={totalPages}
        handlePrev={handlePrev}
        handleNext={handleNext}
        windowWidth={windowWidth}
        showMoreMobile={
          !isServerPaginated &&
          windowWidth < 640 &&
          currentItems.length < imoveis.length
            ? showMoreMobile
            : null
        }
      />

    </div>
  );
}
