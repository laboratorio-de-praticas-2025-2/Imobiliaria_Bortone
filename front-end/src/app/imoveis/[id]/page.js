"use client";

import ShareButton from "@/components/blog/ShareButton";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";

import "@/styles/imoveis.css";
import { buildImageUrl } from "@/utils/imageUtils";
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
import axios from "axios";
import SplashScreen from "@/components/SplashScreen";

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
            mapRef.current.remove();
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !id) return;

    const registrarVisita = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/recomendacao_imovel`,
          {
            usuario_id: userInfo.id,
            imovel_id: Number(id),
            data_visita: new Date().toISOString().slice(0, 10),
          }
        );
      } catch (err) {
        console.error("Erro ao registrar visita:", err);
      }
    };

    registrarVisita();
  }, []);

  useEffect(() => {
    const fetchImovel = async () => {
      
  try {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Buscar dados do imóvel
    const imovelResponse = await axios.get(`${apiUrl}/imoveis/${id}`);
    const imovelData = imovelResponse.data;
    
    // Buscar imagens do imóvel, mas não falhar se não encontrar
    let imagesData = [];
    try {
      const imagesResponse = await axios.get(`${apiUrl}/imagemimovel/imovel/${id}`);
      imagesData = imagesResponse.data;
    } catch (imageError) {
      console.log("Nenhuma imagem encontrada para este imóvel");
      // Continue without images
    }
    
    // Combinar dados do imóvel com imagens (vazias se não encontradas)
    const imovelCompleto = {
      ...imovelData,
      imagens: Array.isArray(imagesData) ? imagesData : []

    };
    
    setImoveis([imovelCompleto]);
  } catch (error) {
    console.error("Erro ao carregar imóvel:", error);
    // Only show "Post não encontrado" if the imóvel itself wasn't found
    if (error.response?.status === 404) {
      setImoveis([]);
    }
  } finally {
    setLoading(false);
  }
};
    fetchImovel();
  }, [id]);

  useEffect(() => {
    if (descricaoRef.current) {
      const alturaTotal = descricaoRef.current.scrollHeight;
      const alturaLimitada = 100;
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
      ? `${imovelAtual.tipo} com ${imovelAtual.casa?.quartos || 0} quartos, ${
          imovelAtual.casa?.banheiros || 0
        } banheiros em ${imovelAtual.endereco}. ${
          imovelAtual.descricao?.substring(0, 120) ||
          "Imóvel de qualidade em excelente localização."
        }`
      : "Imóvel de qualidade em excelente localização.",
    keywords: imovelAtual
      ? `${imovelAtual.tipo}, ${imovelAtual.endereco}, imóvel, ${imovelAtual.casa?.quartos || 0} quartos, ${imovelAtual.casa?.banheiros || 0} banheiros`
      : "imóvel, casa, apartamento",
    url: `https://imobiliaria-bortone.vercel.app/imoveis/${id}`,
    image: imovelAtual?.imagens?.[0]?.url_imagem || "https://imobiliaria-bortone.vercel.app/404.png",
  });

  if (loading || !imovelAtual) return <SplashScreen />;
  const slides = imovelAtual?.imagens || [];
  const toggleVerMais = () => setVerMais(!verMais);

  // Função para obter URL da imagem com fallback
  const getImageSrc = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return "/404.png";
    }
    return buildImageUrl(imageUrl, "imovel", "/404.png");
  };

  // Se não há imagens, criar um slide padrão com 404.png
  const slidesToRender = slides.length > 0 ? slides : [{ url_imagem: null }];

  const preco =
    imovelAtual?.visibilidade_preco === 0 || imovelAtual?.visibilidade_preco === false
      ? "Valor Oculto"
      : Number(imovelAtual.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />

      <main className="flex-1 teste">
        {/* Carrossel */}
        <div className="imoveis-carousel">
          {slides.length === 0 && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm z-10">
              Imagens não disponíveis
            </div>
          )}
          {slidesToRender.length > 1 ? (
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
              {slidesToRender.map((slide, idx) => (
                <SwiperSlide key={idx} className="flex justify-center">
                  <div className="slide-card w-full">
                    <Image
                      src={getImageSrc(slide.url_imagem)}
                      alt={slide.url_imagem ? `Imóvel ${imovelAtual.id}` : `Imóvel ${imovelAtual.id} - Imagem não disponível`}
                      width={407}
                      height={195}
                      className="carousel-img h-[520px]"
                      onError={(e) => {
                        e.target.src = "/404.png";
                      }}
                      priority={idx === 0} // Prioridade para primeira imagem
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            slidesToRender.map((slide, idx) => (
              <div key={idx} className="slide-card w-full">
                <Image
                  src={getImageSrc(slide.url_imagem)}
                  alt={slide.url_imagem ? `Imóvel ${imovelAtual.id}` : `Imóvel ${imovelAtual.id} - Imagem não disponível`}
                  width={407}
                  height={195}
                  className="carousel-img object-cover rounded-lg aspect-video"
                  onError={(e) => {
                    e.target.src = "/404.png";
                  }}
                  priority={idx === 0} // Prioridade para primeira imagem
                />
              </div>
            ))
          )}
          {slidesToRender.length > 1 && (
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

                {imovelAtual?.tipo?.toLowerCase() === "casa" ||
                imovelAtual?.tipo?.toLowerCase() === "apartamento" ? (

                  <>
                    <p>{imovelAtual.tipo}</p>
                    <p className="T1ponto"> • </p>
                    <p>{imovelAtual.area}m²</p>
                  </>

                ) : imovelAtual?.tipo?.toLowerCase() === "terreno" ? (

                  <>
                    <p>{imovelAtual.tipo}</p>
                  </>
                ) : null}
              </div>

              <div className="t2">
                {imovelAtual?.tipo === "Casa" ||
                imovelAtual?.tipo === "Apartamento" ? (
                  <>
                    <div className="h-auto flex items-center justify-center !text-lg md:!text-2xl">
                      <BsDoorOpenFill />
                    </div>
                    <p className="!text-lg md:!text-2xl">
                      {imovelAtual.casa?.quartos || 0} quartos
                    </p>
                    <div className="h-auto flex items-center justify-center !text-lg md:!text-2xl">
                      <PiBathtub />
                    </div>
                    <p className="!text-lg md:!text-2xl">
                      {imovelAtual.casa?.banheiros || 0} banheiros
                    </p>
                  </>
                ) : imovelAtual?.tipo === "Terreno" ? (
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
              <Link href={`/agendamento/${imovelAtual?.id || ''}`}>
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
              <p className="preco">{preco}</p>
            </div>
            <div className="md:pl-[10%] hidden md:flex">
              <ShareButton />
            </div>
            <div className="Ibotao">
              <Link
                className="SimComp_botao !text-sm md:!text-xl"
                href={{
                  pathname: '/simulacao',
                  query: {
                    valor: imovelAtual?.preco ?? 0,
                    imovelId: imovelAtual?.id ?? id
                  }
                }}
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
                  {imovelAtual?.endereco}
                </p>
                <p className="text-[var(--primary)]">{imovelAtual?.cidade}</p>
              </div>
              <FaArrowRight color="#304383" />
            </Link>

            <LeafletMap
              latitude={imovelAtual?.latitude || -23.5505}
              longitude={imovelAtual?.longitude || -46.6333}
            />
          </div>

          {/* Descrição expandida */}
          <div className="map_desc">
            <h2>Descrição</h2>
            <p
              ref={descricaoRef}
              className={verMais ? "descricao-expandida" : "descricao-reduzida"}
            >
              {imovelAtual?.descricao}
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
