"use client";
import { Pagination } from "antd";
import { useState } from "react";

export default function TableFooter({ postsData, pageSize, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page); // avisa o pai
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <div className="bg-white p-4 py- relative flex items-center">
      {/* Paginação centralizada */}
      <div className="absolute left-1/2 -translate-x-1/2">
          <Pagination
            className="custom-pagination-cms"
            current={currentPage}
            pageSize={pageSize}
            total={postsData.length}
            onChange={handleChange}
            itemRender={(_, type, originalElement) => {
              if (type === "prev") {
                return <span>&lt; Anterior</span>;
              }
              if (type === "next") {
                return <span>Próximo &gt;</span>;
              }
              return originalElement;
            }}
          />
      </div>

      {/* Texto alinhado à direita */}
      <div className="ml-auto">
        <p className="text-sm text-gray-600">
          Exibindo {startIndex + 1} - {Math.min(endIndex, postsData.length)} de{" "}
          {postsData.length} registros
        </p>
      </div>
    </div>
  );
}
