import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function GridImoveisFooter({
  currentPage,
  totalPages,
  handlePrev,
  handleNext,
  windowWidth,
  showMoreMobile,
}) {
  return (
    <>
      {/* Paginação (Desktop/Mobile >= 640px) */}
      {windowWidth >= 640 && totalPages > 1 && (
        <div className="flex justify-end items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-full border bg-[var(--primary)] !text-white border-[var(--primary)] hover:bg-white hover:!text-[var(--primary)] transition-colors disabled:hidden cursor-pointer"
          >
            <IoIosArrowBack />
          </button>

          <span className="text-[var(--primary)] font-medium">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border bg-[var(--primary)] !text-white border-[var(--primary)] hover:bg-white hover:!text-[var(--primary)] transition-colors disabled:hidden cursor-pointer"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}

      {/* Botão mobile "Mostrar mais" */}
      {windowWidth < 640 && showMoreMobile && (
        <div className="flex justify-center mt-6 w-full px-4">
          <button
            onClick={showMoreMobile}
            className="px-6 py-2 rounded-full bg-white border-2 border-[var(--primary)] !text-[var(--primary)] font-medium hover:bg-[var(--primary)] hover:!text-white transition w-full cursor-pointer"
          >
            Mostrar mais anúncios
          </button>
        </div>
      )}
    </>
  );
}
