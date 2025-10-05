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

  // Se não há URL de imagem, não renderizar o componente
  if (!url_imagem) {
    console.warn('PublicidadeImage: url_imagem não fornecida');
    return null;
  }

    // Função para determinar a URL correta da imagem
  const getValidImageSrc = () => {
    // Se houve erro de carregamento, mostrar imagem 404
    if (error) return '/404.png';
    
    const placeholder = '/images/casa.png';
    
    if (!url_imagem || typeof url_imagem !== 'string' || !url_imagem.trim()) {
      return placeholder;
    }

    const src = url_imagem.trim();
    
    // Se a URL contém "publicidade" e é do Cloudinary, usar proxy para evitar ad blockers
    if (src.includes('publicidade') && src.includes('res.cloudinary.com')) {
      return `/api/proxy-image?url=${encodeURIComponent(src)}`;
    }
    
    // Se já é uma URL completa do Cloudinary, usar diretamente
    if (src.startsWith('https://res.cloudinary.com/')) {
      return src;
    }
    
    // Para qualquer outra URL HTTPS, usar diretamente
    if (src.startsWith('https://')) {
      return src;
    }
    
    // Se chegou até aqui, algo está errado
    return placeholder;
  };

  const handleError = () => {
    console.warn(`Erro ao carregar imagem: ${url_imagem}`);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const imageSrc = getValidImageSrc();
  const isPlaceholder = imageSrc === '/images/casa.png' || imageSrc === '/404.png';

  return (
    <div className="relative">
            <Image
        src={getValidImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+8"
        priority={isPlaceholder} // Priority para placeholders
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ 
          width: isPlaceholder ? 'auto' : undefined,
          height: isPlaceholder ? 'auto' : undefined
        }}
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