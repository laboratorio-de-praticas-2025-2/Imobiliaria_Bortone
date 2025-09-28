"use client";
import { useState, useEffect } from 'react';
import PublicidadeImage from '@/components/PublicidadeImage';
import axios from 'axios';

export default function PublicidadeCarousel() {
  const [publicidades, setPublicidades] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicidadesAtivas = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/publicidade`);

        const publicidadesAtivas = response.data.data.filter(pub => pub.ativo === true);
        setPublicidades(publicidadesAtivas);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar publicidades:', error);
        setLoading(false);
      }
    };

    fetchPublicidadesAtivas();
  }, []);


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
                 className="max-w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
               />
             </div>
           </div>
         );
}
