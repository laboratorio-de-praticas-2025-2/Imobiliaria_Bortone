"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";

import "swiper/css";
import "swiper/css/navigation";

// Função helper para construir URL de imagem corretamente
const getImageUrl = (urlImagem) => {
  if (!urlImagem) return null;
  
  // Se já é uma URL completa, retorna como está
  if (urlImagem.startsWith("http://") || urlImagem.startsWith("https://")) {
    return urlImagem;
  }
  
  // Se começa com /, é um caminho absoluto do backend
  if (urlImagem.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${urlImagem}`;
  }
  
  // Se não tem /, assume que é apenas o nome do arquivo
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${urlImagem}`;
};

// Slides padrão como fallback
const defaultSlides = [
  { id: 1, url: "/images/slide1.png" },
  { id: 2, url: "/images/slide2.png" },
  { id: 3, url: "/images/slide3.png" },
  { id: 4, url: "/images/slide1.png" },
  { id: 5, url: "/images/slide2.png" },
  { id: 6, url: "/images/slide3.png" },
];

export default function HeaderSlider() {
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Função para buscar banners ativos do backend
  const fetchActiveBanners = async () => {
    if (!isMounted) return; // Não executar se componente não estiver montado
    
    try {
      setLoading(true);
      
      console.log("🎠 Buscando banners ativos para carrossel...");
      console.log("🌍 Hostname atual:", window.location.hostname);
      
      let data;
      
      // Verificar se estamos em produção (Vercel)
      const isVercel = window.location.hostname.includes('vercel.app');
      
      try {
        if (isVercel) {
          console.log("🌐 Ambiente Vercel detectado, usando proxy...");
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-bortone.onrender.com';
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(`${apiUrl}/banner`)}`;
          const proxyResponse = await fetch(proxyUrl);
          
          if (!proxyResponse.ok) {
            throw new Error(`Proxy error: ${proxyResponse.status} ${proxyResponse.statusText}`);
          }
          
          data = await proxyResponse.json();
          console.log("📊 Dados via proxy:", data);
        } else {
          console.log("🏠 Ambiente local detectado, usando apiClient...");
          const response = await apiClient.get("/banner");
          data = response.data;
          console.log("📊 Dados via apiClient:", data);
        }
      } catch (primaryError) {
        console.warn("⚠️ Erro na requisição primária:", primaryError.message);
        
        // Fallback: tentar o método alternativo
        try {
          if (isVercel) {
            console.log("🔄 Tentando apiClient como fallback...");
            const response = await apiClient.get("/banner");
            data = response.data;
            console.log("📊 Dados via apiClient (fallback):", data);
          } else {
            console.log("🔄 Tentando proxy como fallback...");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-bortone.onrender.com';
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(`${apiUrl}/banner`)}`;
            const proxyResponse = await fetch(proxyUrl);
            
            if (!proxyResponse.ok) {
              throw new Error(`Proxy fallback error: ${proxyResponse.status} ${proxyResponse.statusText}`);
            }
            
            data = await proxyResponse.json();
            console.log("📊 Dados via proxy (fallback):", data);
          }
        } catch (fallbackError) {
          console.error("❌ Ambos os métodos falharam:", fallbackError.message);
          throw new Error(`API e Proxy falharam: ${primaryError.message} | ${fallbackError.message}`);
        }
      }
      
      // Validação básica dos dados
      if (!Array.isArray(data)) {
        throw new Error("Dados recebidos não são um array");
      }
      
      // Filtra apenas banners ativos
      const bannersAtivos = data.filter(banner => banner.ativo === 1);
      console.log(`✅ Banners ativos encontrados: ${bannersAtivos.length}`);
      
      if (bannersAtivos.length > 0 && isMounted) {
        // Converte banners para formato de slides
        const slidesFromBanners = bannersAtivos.map(banner => ({
          id: banner.id,
          url: getImageUrl(banner.url_imagem),
          alt: banner.descricao || `Banner ${banner.id}`,
          originalUrl: banner.url_imagem
        }));
        
        // Log das URLs processadas
        slidesFromBanners.forEach((slide, index) => {
          console.log(`🖼️ Slide ${index + 1}:`, {
            id: slide.id,
            original: slide.originalUrl,
            processed: slide.url
          });
        });
        
        if (isMounted) {
          setSlides(slidesFromBanners);
          console.log("🎉 Carrossel atualizado com banners ativos!");
        }
      } else if (isMounted) {
        console.log("⚠️ Nenhum banner ativo encontrado, usando slides padrão");
        setSlides(defaultSlides);
      }
      
    } catch (error) {
      console.error("❌ Erro ao buscar banners ativos:", error);
      if (isMounted) {
        console.log("🔄 Usando slides padrão como fallback");
        setSlides(defaultSlides);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Reset do estado ao montar o componente
    setSlides(defaultSlides);
    setLoading(true);
    
    fetchActiveBanners();
    
    // Listener para reset da página
    const handlePageReset = (event) => {
      console.log('🎠 HeaderSlider recebeu sinal de reset, recarregando banners...');
      if (event.detail?.from === 'admin') {
        setSlides(defaultSlides);
        setLoading(true);
        fetchActiveBanners();
      }
    };

    window.addEventListener('pageReset', handlePageReset);
    
    // Cleanup ao desmontar
    return () => {
      setIsMounted(false);
      window.removeEventListener('pageReset', handlePageReset);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full">
        <div className="w-[90%] mx-auto h-[195px] bg-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-gray-500">Carregando banners...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        loop={true}
        grabCursor={true}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1 }, 
          640: { slidesPerView: 2 },  
          1024: { slidesPerView: 3 },  
          1440: { slidesPerView: 4 },  
        }}
        className="w-[90%] mx-auto"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="flex justify-center">
            <div className="rounded-xl overflow-hidden w-full max-w-[28rem]">
              <Image
                src={slide.url}
                alt={slide.alt || `Imóvel ${index + 1}`}
                width={407}
                height={195}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  import('../../utils/imageErrorManager.js').then(({ handleImageError }) => {
                    handleImageError(e, "/404.png", "HeaderSlider");
                  });
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botões de navegação */}
      <button className="custom-prev absolute top-1/2 left-0 -translate-y-1/2 z-20">
        <IoIosArrowBack size={30} color="#374a8c" />
      </button>
      <button className="custom-next absolute top-1/2 right-0 -translate-y-1/2 z-20">
        <IoIosArrowForward size={30} color="#374a8c" />
      </button>
    </div>
  );
}