"use client";
import { useState, useEffect } from 'react';
import PublicidadeImage from '@/components/PublicidadeImage';
import { apiClient } from '@/utils/apiClient';

const getImageOrientation = (url) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      // Se a altura for maior que a largura, é vertical
      resolve(img.height > img.width ? 'vertical' : 'horizontal');
    };
    img.onerror = () => resolve('error');
  });
};

export default function PublicidadeCarousel({ startIndex = 0, tipo = 'horizontal' }) {
  const [publicidades, setPublicidades] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);

  const getImageOrientation = (url) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        // Se a altura for maior que a largura, é vertical
        resolve(img.height > img.width ? 'vertical' : 'horizontal');
      };
      img.onerror = () => resolve('error');
    });
  };

  useEffect(() => {
    const fetchPublicidadesAtivas = async () => {
      try {
        const response = await apiClient.get('/publicidade');

        const publicidadesAtivas = response.data.data.filter(pub => pub.ativo === true);
        
        const filtradasComOrientacao = await Promise.all(
          publicidadesAtivas.map(async (pub) => {
            const orientacao = await getImageOrientation(pub.url_imagem);
            return { ...pub, orientacaoReal: orientacao}
          })
        );

        const final = filtradasComOrientacao.filter(pub => pub.orientacaoReal === tipo);
        
        // Ajustar o índice inicial se for maior que o número de publicidades
        const adjustedIndex = Math.min(startIndex, final.length - 1);
        setCurrentIndex(Math.max(0, adjustedIndex));
        
        setPublicidades(final); 
        setLoading(false);
      } catch (error) {
        // Silenciar logs de erro para publicidades
        // console.error('Erro ao buscar publicidades:', error);
        setLoading(false);
      }
    };

    fetchPublicidadesAtivas();
  }, [tipo, startIndex]);


  useEffect(() => {
    if (publicidades.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === publicidades.length - 1 ? 0 : prevIndex + 1
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [publicidades.length]);

  if (loading) {
    return (
      <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (publicidades.length === 0) {
    return (
      <div className="w-full h-24 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg flex items-center justify-center">
        <p className="text-white font-semibold">Nenhuma publicidade ativa</p>
      </div>
    );
  }

  const currentPublicidade = publicidades[currentIndex];

  return (
           <div className="w-full relative">

             <div className="flex justify-center">
               <PublicidadeImage
                 url_imagem={currentPublicidade.url_imagem}
                 alt={currentPublicidade.titulo || 'Publicidade'}
                 width={500}
                 height={350}
                 className="max-w-full object-contain rounded-lg border-2 border-gray-200"
               />
             </div>
           </div>
         );
}
