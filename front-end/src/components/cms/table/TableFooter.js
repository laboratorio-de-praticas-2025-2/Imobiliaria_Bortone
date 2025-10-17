"use client";
import { Pagination } from "antd";
import { useEffect } from "react";

export default function TableFooter({
  postsData, // Pra compatibilidade com paginação client-side 
  totalItems, // Pra compatibilidade com paginação server-side
  pageSize = 10, //Default
  currentPage = 1,
  onPageChange,
}) {
  const total = totalItems ?? postsData?.length ?? 0;

  const handleChange = (page) => {
    if (onPageChange) onPageChange(page);
  };

  useEffect(() => {
    if (onPageChange) {
      onPageChange(1);
    }
  }, [total]);

  const calculateRange = () => {
    if (!total || total === 0) return { start: 0, end: 0 };

    // Garantir que currentPage seja um número válido
    const safeCurrentPage =
      Number.isFinite(Number(currentPage)) && Number(currentPage) > 0
        ? Number(currentPage)
        : 1;

    const start = (safeCurrentPage - 1) * pageSize + 1;
    const calculatedEnd = safeCurrentPage * pageSize;
    const end = Math.min(calculatedEnd, total);

    return { start, end };
  };

  const { start, end } = calculateRange();

  // valor seguro para passar ao componente de paginação
  const safeCurrentPage =
    Number.isFinite(Number(currentPage)) && Number(currentPage) > 0
      ? Number(currentPage)
      : 1;

  return (
    <div className="bg-white p-4 py- relative flex items-center md:flex-row flex-col">
      {/* Paginação centralizada */}
      <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
        <Pagination
          className="custom-pagination-cms"
          current={safeCurrentPage}
          pageSize={pageSize}
          total={total}
          onChange={handleChange}
          showSizeChanger={false}
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