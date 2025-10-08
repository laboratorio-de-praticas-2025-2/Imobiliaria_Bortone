"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCloudinaryImage } from '@/utils/cloudinaryImageUtils';

/**
 * Componente de imagem otimizado para Cloudinary com fallback robusto
 * @param {Object} props
 * @param {string} props.src - URL da imagem (pode ser do Cloudinary, backend, ou relativa)
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.type - Tipo de conteúdo ('banner', 'imovel', 'blog', etc.)
 * @param {number} props.width - Largura da imagem
 * @param {number} props.height - Altura da imagem
 * @param {string} props.className - Classes CSS
 * @param {Object} props.cloudinaryOptions - Opções específicas do Cloudinary
 * @param {boolean} props.unoptimized - Desabilitar otimização do Next.js
 * @param {string} props.fallback - Imagem de fallback customizada
 * @returns {JSX.Element}
 */
export default function CloudinaryImage({
  src,
  alt = 'Imagem',
  type = 'default',
  width = 800,
  height = 600,
  className = '',
  cloudinaryOptions = {},
  unoptimized = true,
  fallback = '/404.png',
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usar o hook Cloudinary
  const { src: optimizedSrc, handleError } = useCloudinaryImage(src, type);
  
  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = (e) => {
    console.warn('CloudinaryImage: Erro ao carregar', {
      original: src,
      optimized: optimizedSrc,
      fallback
    });
    
    setImageError(true);
    setIsLoading(false);
    handleError(e);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Se houve erro, mostrar fallback
  if (imageError) {
    return (
      <Image
        src={fallback}
        alt={`${alt} (fallback)`}
        width={width}
        height={height}
        className={`${className} opacity-50`}
        unoptimized={unoptimized}
        onLoad={handleImageLoad}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`}
          style={{ width, height }}
        />
      )}
      
      {/* Imagem principal */}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        unoptimized={unoptimized}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
}

/**
 * Versão mais simples para uso com tags <img> nativas
 */
export function CloudinaryImg({
  src,
  alt = 'Imagem',
  type = 'default',
  className = '',
  fallback = '/404.png',
  ...props
}) {
  const { src: optimizedSrc, handleError } = useCloudinaryImage(src, type);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}