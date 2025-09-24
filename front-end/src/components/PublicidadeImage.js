"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function PublicidadeImage({ 
  url_imagem, 
  alt = "Imagem da publicidade", 
  width = 425, 
  height = 130, 
  className = "", 
  ...props 
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para determinar a URL correta da imagem
  const getImageSrc = () => {
    // Se houve erro, usar imagem padrão
    if (error) {
      return "/images/placeholder.jpg";
    }

    // Se não há URL válida, usar imagem padrão
    if (!url_imagem || 
        url_imagem === null || 
        url_imagem === "" || 
        url_imagem === "null" ||
        typeof url_imagem !== 'string') {
      return "/images/placeholder.jpg";
    }
    
    // Se já começa com /, usar diretamente
    if (url_imagem.startsWith('/')) {
      return url_imagem;
    }
    
    // Se não começa com /, adicionar o prefixo
    return `/images/publicidadeImages/${url_imagem}`;
  };

  const handleError = () => {
    console.log('Erro ao carregar imagem da publicidade:', url_imagem);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative">
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+8"
        {...props}
      />
      
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Usando imagem padrão
        </div>
      )}
    </div>
  );
}