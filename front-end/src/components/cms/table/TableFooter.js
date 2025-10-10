"use client";
import { Pagination } from "antd";
import { useEffect } from "react";

export default function TableFooter({
  postsData, // For backward compatibility (client-side pagination)
  totalItems, // For server-side pagination
  pageSize = 10, // Default to 10 if not provided
  currentPage,
  onPageChange,
}) {
  // Determine the total number of items
  const total = totalItems ?? postsData?.length ?? 0;

  const handleChange = (page) => {
    if (onPageChange) onPageChange(page);
  };

  useEffect(() => {
    if (onPageChange) {
      onPageChange(1);
    }
  }, [total]);

  // Calculate display range
  const calculateRange = () => {
    if (!total || total === 0) return { start: 0, end: 0 };

    const start = (currentPage - 1) * pageSize + 1;
    const calculatedEnd = currentPage * pageSize;
    const end = Math.min(calculatedEnd, total);

    return { start, end };
  };

  const { start, end } = calculateRange();

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
          Exibindo {total > 0 ? start : 0} - {end} de {total}{" "}
          registros
        </p>
      </div>
    </div>
  );
}