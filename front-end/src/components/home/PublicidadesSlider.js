"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const slides = [
  { id: 1, url: "/images/dudaShop.png" },
  { id: 2, url: "/images/dudaShop.png" },
  { id: 3, url: "/images/dudaShop.png" },
  { id: 4, url: "/images/dudaShop.png" },
];

export default function PublicidadeSlider() {
  return (
    <div className="relative w-full py-7">
      <Swiper
        modules={[Navigation, Autoplay]}
        loop={true}
        grabCursor={true}
        spaceBetween={16}
        speed={6000}
        autoplay={{
          delay: 0, 
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 1.4 },
          1024: { slidesPerView: 2.2 },
          1440: { slidesPerView: 2.2 },
        }}
        className="w-[90%] mx-auto rounded-3xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="flex justify-center">
            <div className="rounded-xl overflow-hidden w-full max-w-[54rem]">
              <Image
                src={slide.url}
                alt={`Publi ${index + 1}`}
                width={858}
                height={225}
                className="w-full h-auto object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
