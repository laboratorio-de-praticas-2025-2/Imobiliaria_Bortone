import { useState, useEffect, useRef, useCallback } from "react";
import ImovelCard from "./ImovelCard";
import Link from "next/link";
import { Button, Spin } from "antd";

export default function GridImoveis({ imoveis, loading, onLoadMore, hasMore }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const observer = useRef();
  const lastImovelElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!imoveis.length && !loading) {
    return (
      <div className="w-full text-center py-20">
        <div className="text-xl text-gray-500 mb-4">
          Nenhum imóvel encontrado
        </div>
        <div className="text-gray-400">
          Tente ajustar os filtros de pesquisa
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {imoveis.map((imovel, index) => (
          <div
            key={`${imovel.id}-${index}`}
            ref={index === imoveis.length - 1 ? lastImovelElementRef : null}
          >
            <Link href="/imoveis/[id]" as={`/imoveis/${imovel.id}`}>
              <ImovelCard imovel={imovel} />
            </Link>
          </div>
        ))}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="w-full text-center py-8">
          <Spin size="large" />
          <div className="mt-4 text-gray-500">Carregando mais imóveis...</div>
        </div>
      )}

      {/* Load more button for fallback */}
      {!loading && hasMore && windowWidth < 640 && (
        <div className="w-full text-center py-8">
          <Button 
            type="primary" 
            size="large"
            onClick={onLoadMore}
            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
          >
            Carregar mais imóveis
          </Button>
        </div>
      )}

      {/* End message */}
      {!loading && !hasMore && imoveis.length > 0 && (
        <div className="w-full text-center py-8 text-gray-500">
          Todos os imóveis foram carregados
        </div>
      )}
    </div>
  );
}
