"use client";

import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import { Input } from "antd";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/imoveis.css";
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';


const { Search } = Input;
const onSearch = (value) => console.log(value);

const slides = [
  { id: 1, url: "/images/imovel1.png" },
  { id: 2, url: "/images/imovel2.png" },
  { id: 3, url: "/images/imovel3.png" },
];

export default function Mapa() {
  useEffect(() => {
  const mapContainer = document.getElementById("map-pequeno");
  if (!mapContainer || mapContainer.children.length > 0) return;

  import("leaflet").then(L => {
    const map = L.map(mapContainer).setView([-23.7092, -47.8433], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

  
    const customIcon = L.icon({
    iconUrl: '/images/icon_loc.png',
    iconSize: [32, 32], // tamanho do ícone
    iconAnchor: [16, 32], // ponto do ícone que será ancorado no mapa
    popupAnchor: [0, -32] // onde o popup vai aparecer em relação ao ícone
  });

L.marker([-24.4875, -47.8436], { icon: customIcon }).addTo(map);

  });
}, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />

      <main className="flex-1 teste">
        {/* Barra de pesquisa */}
        <div className="bpq">
          <Search
            placeholder="Pesquisa"
            onSearch={onSearch}
            className="imoveis-search-bar"
          />
        </div>

        {/* Carrossel */}
        <div className="imoveis-carousel">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            loop={true}
            grabCursor={true}
            spaceBetween={0}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },  
              1440: { slidesPerView: 2 },
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="flex justify-center">
                <div className="slide-card w-full">
                  <Image
                    src={slide.url}
                    alt={`Imóvel ${slide.id}`}
                    width={407}
                    height={195}
                    className="carousel-img"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="custom-prev inv">
            <IoIosArrowBack size={30} color="#2C2C2C" />
          </button> 

          <button className="custom-next">
            <IoIosArrowForward size={30} color="#2C2C2C" />
          </button>
        </div>

        {/* Descrição e Valor */}
        <div className="todo">
          <div className="descricao">
            <div className="Dtexto">
              <p>Apartamento para venda  •  226m²</p>
              <p>3 quartos •  2 banheiros</p>
              <p className="Gimovel">Gostou do imóvel?</p>
            </div>
            <div className="Dbotoes">
              <button className="btn1">Agendar visita</button>
              <button className="btn2">Propor valor</button>
            </div>
          </div>

          <div className="valor">
            <div className="Ivalor">
              <p>Valor deste imóvel</p>
              <p className="preco">R$285.000,00</p>
            </div>
            <div className="share">
              <a href="#" className="a">
                <div className="icon_color">
                  <img src="./images/icon_Compartilhar.png" />
                </div>
                <p>Compartilhar</p>
              </a>
            </div>
            <div className="Ibotao">
              <button className="SimComp_botao">Simular Compra</button>
            </div>
          </div>
        </div>

        {/* Mapa pequeno com Leaflet */}
        <div className="todo2">
          <div className="map_loc">
            <div id="map-pequeno" className="mapa-pequeno" />
          </div>
          <div className="map_desc">
          <h2>Descrição</h2>
          <p>Casa ampla com quintal e garagem.Lorem ipsum dolor sit amet. Id quia architecto eos maiores deserunt est libero eaque! Aut rerum porro vel omnis labore ea nisi rerum aut amet voluptas aut voluptatem rerum. Ut dignissimos laborum et natus mollitia non suscipit modi At quas ipsum qui maxime pariatur a voluptatem tempora sit doloribus dolorem! Qui voluptate quos eum dicta omnis sed perferendis saepe nam nostrum eius id dolores officia est dolores internos sit recusandae reiciendis. Lorem ipsum dolor sit amet. Id quia architecto eos maiores deserunt est libero eaque! Aut rerum porro vel omnis labore ea nisi rerum aut amet voluptas aut voluptatem rerum. Ut dignissimos laborum et natus mollitia non suscipit modi At quas ipsum qui maxime pariatur a voluptatem tempora sit...
          </p>
          <button className="btn-ver-mais">
            <img src="/images/seta_baixo.png" alt="Ver mais" />
            <p>Ver mais</p>
          </button>
          </div>

        </div>

        <hr className="linha-divisoria" />

      </main>

      <HomeFooter />
    </div>
  );
}
