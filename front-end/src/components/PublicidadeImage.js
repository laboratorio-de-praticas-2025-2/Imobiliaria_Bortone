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
  const getValidImageSrc = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const placeholder = '/images/casa.png';
    if (!url_imagem || typeof url_imagem !== 'string') return placeholder;

    let src = url_imagem.trim();
    // Normalizar caso backend salve sem barra inicial
    if (!src.startsWith('/')) {
      // Se parece já ser um nome de arquivo salvo pelo multer
      if (!src.startsWith('http')) {
        // Determinar a pasta baseada no href_cms
        const folderMap = {
          'publicidades': 'publicidadeImages',
          'banner': 'bannerImages',
          'publicacoes': 'blogImages'
        };
        const folder = folderMap[href_cms] || 'publicidadeImages';
        src = `/images/${folder}/${src}`;
      }
    }

    // Se for caminho relativo local (/images/...) precisamos usar direto em produção do Next.
    // Porém o erro 400 do _next/image pode ocorrer se a imagem não existir no momento do build ou se houver CSP bloqueando.
    // Para evitar transformação errada pelo loader, podemos usar a URL absoluta do backend se disponível.
    if (src.startsWith('/images/')) {
      // Se apiBase contém domínio (http) e não é o mesmo host do frontend (deploy vercel), usar absoluto.
      if (apiBase.startsWith('http')) {
        // Evitar dupla barra
        const normalizedBase = apiBase.replace(/\/$/, '');
        return `${normalizedBase}${src}`;
      }
      return src; // fallback
    }

    return src;
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
        src={getValidImageSrc()}
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