/* eslint-disable @next/next/no-img-element */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageCarroussel({ imovel }) {
  return (
    <div className="w-full">
      {/* Box fixo p/ o carrossel */}
      <div className="relative w-full aspect-video overflow-hidden sm:rounded-xl">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full image-carroussel-imoveis"
        >
          {imovel.imagens.map((img, index) => (
            <SwiperSlide key={index} className="!w-full !h-full flex">
              <img
                src={img.url_imagem}
                alt={img.descricao}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
