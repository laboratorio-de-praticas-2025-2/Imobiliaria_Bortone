"use client";

import ShareButton from "@/components/blog/ShareButton";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { mockImoveis } from "@/constants/imoveis";
import "@/styles/imoveis.css";
import { Input } from "antd";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";

const { Search } = Input;
const onSearch = (value) => console.log(value);

export default function Mapa() {
  const [verMais, setVerMais] = useState(false);
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // pega o id da URL

  useEffect(() => {
    setLoading(true);
    setImoveis(mockImoveis);
    setLoading(false);
  }, []);

  useEffect(() => {
    const mapContainer = document.getElementById("map-pequeno");
    if (!mapContainer || mapContainer.children.length > 0) return;

    import("leaflet").then((L) => {
      const map = L.map(mapContainer, { zoomControl: false }).setView(
        [-23.7092, -47.8433],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: "/images/icon_loc.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([-23.5505, -46.6333], { icon: customIcon }).addTo(map);
    });
  }, []);

  if (loading) return <div>Carregando...</div>;

  const post = imoveis.find((p) => p.id === Number(id));
  if (!post) return <div>Post não encontrado.</div>;

  const imovelAtual = post;
  const slides = imovelAtual?.imagens || [];
  const toggleVerMais = () => setVerMais(!verMais);

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
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
              1440: { slidesPerView: 2 },
            }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx} className="flex justify-center">
                <div className="slide-card w-full">
                  <Image
                    src={slide.url_imagem}
                    alt={`Imóvel ${imovelAtual.id}`}
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
              <div className="t1">
                {imovelAtual.tipo === "Casa" ||
                imovelAtual.tipo === "Apartamento" ? (
                  <>
                    <p>{imovelAtual.tipo}</p>
                    <p className="T1ponto"> • </p>
                    <p>{imovelAtual.area}m²</p>
                  </>
                ) : imovelAtual.tipo === "Terreno" ? (
                  <>
                    <p>{imovelAtual.tipo}</p>
                  </>
                ) : null}
              </div>

              <div className="t2">
                {imovelAtual.tipo === "Casa" ||
                imovelAtual.tipo === "Apartamento" ? (
                  <>
                    <div className="h-auto flex items-center justify-center !text-lg md:!text-2xl">
                      <BsDoorOpenFill />
                    </div>
                    <p className="!text-lg md:!text-2xl">
                      {imovelAtual.quartos} quartos
                    </p>
                    <div className="h-auto flex items-center justify-center !text-lg md:!text-2xl">
                      <PiBathtub />
                    </div>
                    <p className="!text-lg md:!text-2xl">
                      {imovelAtual.banheiros} banheiros
                    </p>
                  </>
                ) : imovelAtual.tipo === "Terreno" ? (
                  <>
                    <Image
                      src="/images/icon_metroq.png"
                      alt="icon_area"
                      width={27}
                      height={27}
                      className="icon_area"
                    />
                    <p>{imovelAtual.area}m²</p>
                  </>
                ) : null}
              </div>

              <p className="Gimovel">Gostou do imóvel?</p>
            </div>
            <div className="Dbotoes">
              <button className="btn1">Agendar visita</button>
              <button className="btn2">Propor valor</button>
            </div>
            <div className="md:pl-[10%] flex md:hidden absolute bottom-10 pl-[4%]">
              <ShareButton />
            </div>
          </div>

          <div className="valor">
            <div className="Ivalor">
              <p className="Vtxt">Valor deste imóvel</p>
              <p className="preco">R$ {imovelAtual.preco.toLocaleString()}</p>
            </div>
            <div className="md:pl-[10%] hidden md:flex">
              <ShareButton />
            </div>
            <div className="Ibotao">
              <Link
                className="SimComp_botao !text-sm md:!text-xl"
                href="/simulacao"
              >
                Simular{" "}
                <span className="hidden md:flex">&nbsp;financiamento</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mapa pequeno com Leaflet */}
        <div className="todo2">
          <div className="map_loc">
            <Link className="ir_loc" href="/mapa">
              <div className="ir_loc_txt">
                <p>{imovelAtual.endereco}</p>
                <p className="p2">{imovelAtual.cidade}</p>
              </div>
              <div className="ir_loc_icon">
                <Image
                  src="/images/icon_setaD.png"
                  alt="icon_setaD"
                  width={15}
                  height={17}
                  className="icon_setaD"
                  link="/mapa"
                />
              </div>
            </Link>
            <div id="map-pequeno" className="mapa-pequeno" />
          </div>
          <div className="map_desc">
            <h2>Descrição</h2>
            <p
              className={verMais ? "descricao-expandida" : "descricao-reduzida"}
            >
              {imovelAtual.descricao}
            </p>
            <button className="btn-ver-mais" onClick={toggleVerMais}>
              <Image
                src="/images/seta_baixo.png"
                alt="Ver mais"
                width={20}
                height={20}
                className="setaVmais"
              />
              <p>{verMais ? "Ver menos" : "Ver mais"}</p>
            </button>
          </div>
        </div>

        <hr className="linha-divisoria" />
      </main>

      <HomeFooter />
    </div>
  );
}
