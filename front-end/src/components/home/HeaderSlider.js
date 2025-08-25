"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";

const slides = [
  { id: 1, url: "/images/slide1.png" },
  { id: 2, url: "/images/slide2.png" },
  { id: 3, url: "/images/slide3.png" },
  { id: 4, url: "/images/slide1.png" },
  { id: 5, url: "/images/slide2.png" },
  { id: 6, url: "/images/slide3.png" },
];

export default function HeaderSlider() {
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
                alt={`Imóvel ${index + 1}`}
                width={407}
                height={195}
                className="w-full h-auto object-cover"
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
