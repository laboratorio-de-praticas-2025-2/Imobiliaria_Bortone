/* eslint-disable @next/next/no-img-element */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { handleImgError } from "@/utils/imageFallback";
import { buildImageUrl } from "@/utils/imageUtils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageCarroussel({ imovel }) {
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
                src={buildImageUrl(img.url_imagem, 'imovel', '/imovel1.png')}
                alt={img.descricao || "Imagem do imóvel"}
                className="w-full h-full object-cover"
                onError={handleImgError}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
