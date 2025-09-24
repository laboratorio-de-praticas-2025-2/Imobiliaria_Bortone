"use client";

import ShareButton from "@/components/blog/ShareButton";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { mockImoveis } from "@/mock/imoveis";
import "@/styles/imoveis.css";
import { Input, Divider } from "antd";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsDoorOpenFill } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiBathtub } from "react-icons/pi";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSEO } from "@/hooks/useSEO";
import { FaArrowRight } from "react-icons/fa6";

const { Search } = Input;
const onSearch = async (value) => {
  if (!value) return;
  try {
    const res = await fetch(
      `${process.env.API_URL}/search/simples?endereco=${encodeURIComponent(
        value
      )}`,
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Erro ao buscar imóveis");
    const data = await res.json();
    // Atualiza a lista de imóveis exibida
    setImoveis(data);
  } catch (err) {
    console.error("Erro na pesquisa:", err);
  }
};

// Componente de mapa carregado dinamicamente
const LeafletMap = dynamic(
  () =>
    Promise.resolve(({ latitude, longitude }) => {
      const mapRef = useRef(null);

      useEffect(() => {
        if (mapRef.current) return; // evita recriar

        import("leaflet").then((L) => {
          mapRef.current = L.map("map-pequeno", { zoomControl: false }).setView(
            [latitude, longitude],
            13
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapRef.current);

          const customIcon = L.icon({
            iconUrl: "/images/icon_loc.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          L.marker([latitude, longitude], { icon: customIcon }).addTo(
            mapRef.current
          );
        });

        return () => {
          if (mapRef.current) {
            mapRef.current.remove(); // 🔥 destroi o mapa ao desmontar
            mapRef.current = null;
          }
        };
      }, [latitude, longitude]);

      return <div id="map-pequeno" className="mapa-pequeno" />;
    }),
  { ssr: false }
);

export default function Mapa() {
  const [verMais, setVerMais] = useState(false);
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const descricaoRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setImoveis(mockImoveis);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (descricaoRef.current) {
      const alturaTotal = descricaoRef.current.scrollHeight;
      const alturaLimitada = 100; // altura máxima do .descricao-reduzida
      setMostrarBotao(alturaTotal > alturaLimitada);
    }
  }, [imoveis]);

  // Encontrar o imóvel atual
  const post = imoveis.find((p) => p.id === Number(id));
  const imovelAtual = post;

  // SEO dinâmico para imóvel específico - sempre chamado
  useSEO({
    title: imovelAtual
      ? `${imovelAtual.tipo} em ${imovelAtual.endereco}`
      : "Imóvel",
    description: imovelAtual
      ? `${imovelAtual.tipo} com ${imovelAtual.quartos} quartos, ${
          imovelAtual.banheiros
        } banheiros em ${imovelAtual.endereco}. ${
          imovelAtual.descricao?.substring(0, 120) ||
          "Imóvel de qualidade em excelente localização."
        }`
      : "Imóvel de qualidade em excelente localização.",
    keywords: imovelAtual
      ? `${imovelAtual.tipo}, ${imovelAtual.endereco}, imóvel, ${imovelAtual.quartos} quartos, ${imovelAtual.banheiros} banheiros, ${imovelAtual.operacao}`
      : "imóvel, casa, apartamento",
    url: `https://imobiliaria-bortone.vercel.app/imoveis/${id}`,
    image: imovelAtual?.imagens?.[0]?.url_imagem,
  });

  if (loading) return <div>Carregando...</div>;
  if (!post) return <div>Post não encontrado.</div>;
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
          {slides.length > 1 ? (
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
                      className="carousel-img h-[520px]"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            slides.map((slide, idx) => (
              <div key={idx} className="slide-card w-full">
                <Image
                  src={slide.url_imagem}
                  alt={`Imóvel ${imovelAtual.id}`}
                  width={407}
                  height={195}
                  className="carousel-img object-cover rounded-lg aspect-video"
                />
              </div>
            ))
          )}
          {slides.length > 1 && (
            <>
              <button className="custom-prev inv">
                <IoIosArrowBack size={30} color="#2C2C2C" />
              </button>
              <button className="custom-next">
                <IoIosArrowForward size={30} color="#2C2C2C" />
              </button>
            </>
          )}
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
              <Link href={`/agendamento/${imovelAtual.id}`}>
                <button className="btn1">Agendar visita</button>
              </Link>
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

        {/* Mapa */}
        <div className="todo2">
          <div className="map_loc">
            <Link className="ir_loc" href="/mapa">
              <div>
                <p className="text-[var(--primary)] text-xl">
                  {imovelAtual.endereco}
                </p>
                <p className="text-[var(--primary)]">{imovelAtual.cidade}</p>
              </div>
              <FaArrowRight color="#304383" />
            </Link>

            <LeafletMap
              latitude={imovelAtual.latitude || -23.5505}
              longitude={imovelAtual.longitude || -46.6333}
            />
          </div>

          {/* Descrição expandida */}
          <div className="map_desc">
            <h2>Descrição</h2>
            <p
              ref={descricaoRef}
              className={verMais ? "descricao-expandida" : "descricao-reduzida"}
            >
              {imovelAtual.descricao}
            </p>

            {mostrarBotao && (
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
            )}
          </div>
        </div>

        <Divider size="large" />
      </main>

      <HomeFooter />
    </div>
  );
}
