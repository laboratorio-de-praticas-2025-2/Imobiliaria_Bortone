/* eslint-disable @next/next/no-img-element */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "dotenv/config";

export default function ImageCarroussel({ imovel }) {

  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return (
    <div className="w-full">
      {/* Box fixo p/ o carrossel */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden sm:rounded-xl">
        <Swiper
    
          className="w-full h-full image-carroussel-imoveis"
        >
          {(imovel.imagem_imovel ?? []).map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${apiUrl}/images/imoveis/${img.url_imagem}`}
                alt={img.descricao || "Imagem do imóvel"}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
