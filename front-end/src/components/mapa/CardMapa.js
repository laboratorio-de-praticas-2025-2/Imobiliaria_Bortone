/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { handleImgError } from "@/utils/imageFallback";
import { buildImageUrl } from "@/utils/imageUtils";
import { FaShoppingCart } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";

export default function CardMapa({ imovel }) {
  const router = useRouter();

  const preco =
    imovel?.preco === null || imovel?.preco === undefined
      ? "Valor Oculto"
      : Number(imovel.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

  const handleCardClick = (e) => {
    // Previne navegação se clicar nos botões de ação
    if (e.target.closest('button')) {
      return;
    }
    
    console.log(`Navegando para /imoveis/${imovel.id}`);
    router.push(`/imoveis/${imovel.id}`);
  };

  return (
    <div
      key={imovel.id}
      onClick={handleCardClick}
      className="group shrink-0 min-w-[260px] sm:min-w-[260px] lg:min-w-[280px] h-auto p-4 
      border-0 rounded-lg shadow-lg bg-white transform transition-transform duration-300 hover:scale-105 
      cursor-pointer hover:shadow-xl"
    >
      {/* Imagem do imóvel */}
      <div className="w-full h-28 sm:h-36 border-0 rounded-lg overflow-hidden relative">
        <img
          src={buildImageUrl(
            (imovel.imagens &&
              imovel.imagens.length > 0 &&
              imovel.imagens[0].url_imagem) ||
              imovel.imagem,
            "imovel",
            "/imovel1.png"
          )}
          alt={`Imagem do imóvel ${imovel.id}`}
          className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-105"
          onError={handleImgError}
        />
      </div>

      {/* Preço / Carrinho / Chat */}
      <div className="flex flex-row gap-4 mt-1 items-center">
        <div className="inline-block rounded font-bold text-xl sm:text-2xl text-left overflow-hidden px-3">
          {preco}
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Botão carrinho clicado para imóvel:", imovel.id);
              // Aqui você pode implementar a ação do carrinho
            }}
            className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110"
          >
            <FaShoppingCart className="text-[var(--primary)]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Botão chat clicado para imóvel:", imovel.id);
              // Aqui você pode implementar a ação do chat
            }}
            className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110"
          >
            <RiMessage2Fill className="text-[var(--primary)]" />
          </button>
        </div>
      </div>

      {/* Localização */}
      <div className="w-full h-7 sm:h-9 flex items-center justify-left font-bold pl-2 whitespace-nowrap">
        {imovel.endereco}
      </div>

      {/* Informações específicas por tipo */}
      <div className="inline-flex flex-row gap-2 mt-2">
        {imovel.tipo === "Casa" || imovel.tipo === "Apartamento" ? (
          <>
            {/* Quartos */}
            <div className="flex flex-col w-auto whitespace-nowrap">
              <div className="h-auto flex items-center justify-center px-2">
                <BsDoorOpenFill className="text-[var(--primary)] text-lg" />
              </div>
              <div className="h-auto flex items-center justify-center px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
                {imovel.quartos || imovel.casa?.quartos || 0} Quartos
              </div>
            </div>
            {/* Banheiros */}
            <div className="flex flex-col w-auto whitespace-nowrap">
              <div className="h-auto flex items-center justify-center px-2">
                <PiBathtub className="text-[var(--primary)] text-lg" />
              </div>
              <div className="h-auto flex items-center justify-center px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
                {imovel.banheiros || imovel.casa?.banheiros || 0} Banheiros
              </div>
            </div>
          </>
        ) : imovel.tipo === "Terreno" ? (
          <div className="flex flex-col w-auto whitespace-nowrap">
            <div className="h-auto flex items-center justify-center px-2 font-bold text-sm text-[var(--primary)]">
              Terreno - {imovel.area}m²
            </div>
            {imovel.murado && (
              <div className="h-auto flex items-center justify-center px-2 text-xs text-gray-600">
                Murado
              </div>
            )}
          </div>
        ) : (
          <div className="h-auto flex items-center justify-center px-2 font-bold text-sm text-[var(--primary)]">
            {imovel.tipo}
          </div>
        )}
      </div>
    </div>
  );
}
