"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

const BACKEND_BASE_URL = "http://localhost:4000";

// 🔥 FUNÇÃO getImageUrl CORRIGIDA - para front-end
const getImageUrl = (urlImagem) => {
  if (!urlImagem) return "/images/slide1.png"; // Fallback
  
  console.log("🖼️ URL original:", urlImagem);
  
  // Se já é uma URL completa, retorna como está
  if (urlImagem.startsWith("http://") || urlImagem.startsWith("https://")) {
    return urlImagem;
  }
  
  // 🔥 CORREÇÃO: Para imagens no FRONT-END, use caminho relativo
  // As imagens estão em public/uploads/banners/
  if (urlImagem.startsWith("/uploads/")) {
    return urlImagem; // Já está no formato correto para front-end
  }
  
  // Se for apenas o nome do arquivo, construa o caminho correto
  if (!urlImagem.startsWith("/") && !urlImagem.startsWith("http")) {
    return `/uploads/banners/${urlImagem}`;
  }
  
  return "/images/slide1.png"; // Fallback padrão
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

  // Função para buscar banners ativos do backend
  const fetchActiveBanners = async () => {
    try {
      setLoading(true);
      
      console.log("🎠 Buscando banners ativos para carrossel...");
      
      const response = await fetch(`${BACKEND_BASE_URL}/banner`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 Dados recebidos do backend:", data);
      
      // Validação básica dos dados
      if (!Array.isArray(data)) {
        throw new Error("Dados recebidos não são um array");
      }
      
      // Filtra apenas banners ativos
      const bannersAtivos = data.filter(banner => banner.ativo === 1);
      console.log(`✅ Banners ativos encontrados: ${bannersAtivos.length}`);
      
      if (bannersAtivos.length > 0) {
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
        
        setSlides(slidesFromBanners);
        console.log("🎉 Carrossel atualizado com banners ativos!");
      } else {
        console.log("⚠️ Nenhum banner ativo encontrado, usando slides padrão");
        setSlides(defaultSlides);
      }
      
    } catch (error) {
      console.error("❌ Erro ao buscar banners ativos:", error);
      console.log("🔄 Usando slides padrão como fallback");
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBanners();
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
                  console.error("❌ Erro ao carregar imagem:", slide.url);
                  console.log("🔄 Tentando fallback...");
                  // Fallback para imagem padrão se houver erro
                  e.target.src = "/images/slide1.png";
                }}
                onLoad={() => {
                  console.log("✅ Imagem carregada com sucesso:", slide.url);
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