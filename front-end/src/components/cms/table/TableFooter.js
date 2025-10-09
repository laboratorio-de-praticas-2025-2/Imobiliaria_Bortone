"use client";
import { Pagination } from "antd";
import { useEffect } from "react";

export default function TableFooter({
  postsData, // For backward compatibility (client-side pagination)
  totalItems, // For server-side pagination
  pageSize,
  currentPage,
  onPageChange,
}) {
  // Determine the total number of items. Prioritize `totalItems` for server-side pagination,
  // but fall back to `postsData.length` for older client-side implementations.
  const total = totalItems ?? postsData?.length ?? 0;

  const handleChange = (page) => {
    if (onPageChange) onPageChange(page);
  };

  useEffect(() => {
    // When filters change the total number of items, reset to page 1.
    // This prevents being on a page that no longer exists.
    if (onPageChange) {
      onPageChange(1);
    }
  }, [total]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return (
    <div className="bg-white p-4 py- relative flex items-center md:flex-row flex-col">
      {/* Paginação centralizada */}
      <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
        <Pagination
          className="custom-pagination-cms"
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handleChange}
          itemRender={(_, type, originalElement) => {
            if (type === "prev") return <span>&lt; Anterior</span>;
            if (type === "next") return <span>Próximo &gt;</span>;
            return originalElement;
          }}
        />
      </div>

      {/* Texto alinhado à direita */}
      <div className="md:ml-auto">
        <p className="text-sm text-gray-600">
          Exibindo {total > 0 ? startIndex + 1 : 0} - {endIndex} de {total}{" "}
          registros
        </p>
      </div>
    </div>
  );
}