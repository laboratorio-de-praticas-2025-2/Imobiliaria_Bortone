"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

// Slides padrão como fallback
const defaultSlides = [
  { id: 1, url: "/imovel1.png", alt: "Imóvel 1" },
  { id: 2, url: "/imovel2.png", alt: "Imóvel 2" },
  { id: 3, url: "/imovel3.png", alt: "Imóvel 3" },
];

export default function HeaderSliderDebug() {
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função de teste simples
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Teste simples de fetch...");
      
      // Teste 1: Fetch direto
      try {
        console.log("📡 Tentativa 1: Fetch direto para API...");
        const response = await fetch('https://imobiliaria-bortone.onrender.com/banner');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ Fetch direto funcionou:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          const bannersAtivos = data.filter(banner => banner.ativo === 1);
          if (bannersAtivos.length > 0) {
            const slides = bannersAtivos.map(banner => ({
              id: banner.id,
              url: banner.url_imagem,
              alt: banner.descricao || `Banner ${banner.id}`
            }));
            setSlides(slides);
            console.log("🎉 Banners carregados com sucesso!", slides);
            setLoading(false);
            return;
          }
        }
      } catch (directError) {
        console.warn("❌ Fetch direto falhou:", directError.message);
        
        // Teste 2: Proxy
        try {
          console.log("📡 Tentativa 2: Usando proxy...");
          const proxyUrl = `/api/proxy?url=${encodeURIComponent('https://imobiliaria-bortone.onrender.com/banner')}`;
          const proxyResponse = await fetch(proxyUrl);
          
          if (!proxyResponse.ok) {
            throw new Error(`Proxy HTTP ${proxyResponse.status}: ${proxyResponse.statusText}`);
          }
          
          const proxyData = await proxyResponse.json();
          console.log("✅ Proxy funcionou:", proxyData);
          
          if (Array.isArray(proxyData) && proxyData.length > 0) {
            const bannersAtivos = proxyData.filter(banner => banner.ativo === 1);
            if (bannersAtivos.length > 0) {
              const slides = bannersAtivos.map(banner => ({
                id: banner.id,
                url: banner.url_imagem,
                alt: banner.descricao || `Banner ${banner.id}`
              }));
              setSlides(slides);
              console.log("🎉 Banners via proxy carregados!", slides);
              setLoading(false);
              return;
            }
          }
        } catch (proxyError) {
          console.error("❌ Proxy também falhou:", proxyError.message);
          setError(`Ambos falharam: ${directError.message} | ${proxyError.message}`);
        }
      }
      
      console.log("⚠️ Usando slides padrão");
      setSlides(defaultSlides);
      
    } catch (error) {
      console.error("❌ Erro geral:", error);
      setError(error.message);
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center">
        <div>Carregando banners...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erro no carregamento:</strong> {error}
        </div>
      )}
      
      <div className="relative group h-96 overflow-hidden">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative">
              <div className="w-full h-full relative">
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={slide.id === slides[0]?.id}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100">
          <IoIosArrowBack size={24} />
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100">
          <IoIosArrowForward size={24} />
        </div>
      </div>
    </div>
  );
}