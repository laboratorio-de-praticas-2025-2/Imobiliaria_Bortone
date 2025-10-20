"use client";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

export default function TableFooterPublicidade({ 
  postsData, 
  pageSize, 
  onPageChange, 
  // Novos props para paginação
  pagination,
  currentPage,
  isLoading 
}) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  // Usar currentPage externo se fornecido, senão usar interno
  const activePage = currentPage || internalCurrentPage;

  // Sincronizar página interna com externa
  useEffect(() => {
    if (currentPage && currentPage !== internalCurrentPage) {
      setInternalCurrentPage(currentPage);
    }
  }, [currentPage]);

  const handleChange = (page) => {
    setInternalCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Determinar dados a usar (novo formato com pagination ou formato antigo)
  const totalItems = pagination ? pagination.totalItems : (postsData?.length || 0);
  const itemsPerPage = pagination ? pagination.itemsPerPage : (pageSize || 10);
  const totalPages = pagination ? pagination.totalPages : Math.ceil(totalItems / itemsPerPage);

  // Calcular índices para exibição
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="bg-white p-4 py- relative flex items-center md:flex-row flex-col">
      {/* Paginação centralizada */}
      <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
        <Pagination
          className="custom-pagination-cms"
          current={activePage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handleChange}
          disabled={isLoading}
          showSizeChanger={false}
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
      <div className="md:ml-auto">
        <p className="text-sm text-gray-600">
          {isLoading ? (
            "Carregando..."
          ) : totalItems > 0 ? (
            <>
              Exibindo {startIndex + 1} - {endIndex} de {totalItems} registros
              {pagination && (
                <span className="ml-2 text-xs text-gray-500">
                  (Página {activePage} de {totalPages})
                </span>
              )}
            </>
          ) : (
            "Nenhum registro encontrado"
          )}
        </p>
      </div>
    </div>
  );
}