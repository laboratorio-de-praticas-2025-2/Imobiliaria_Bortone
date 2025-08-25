"use client";
import React from "react";

export default function CardMapa({ imovel, favoritos, toggleFavorito }) {
  return (
    <div
      key={imovel.id}
      className="group shrink-0 min-w-[260px] sm:min-w-[260px] lg:min-w-[280px] max-w-sm h-auto p-4 
      border-0 rounded-lg shadow-lg bg-white transform transition-transform duration-300 hover:scale-105"
    >
      {/* Imagem do imóvel */}
      <div className="w-full h-28 sm:h-36 border-0 rounded-lg overflow-hidden relative">
        <img
          src={imovel.imagens[0]}
          alt={`Imagem do imóvel ${imovel.id}`}
          className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* Botão de Favoritar */}
        <button
          onClick={() => toggleFavorito(imovel.id)}
          className={`
            absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md
            transition-all duration-200 transform
            ${favoritos[imovel.id] ? "bg-yellow-300" : "bg-white"} 
            hover:scale-110 hover:bg-yellow-100
          `}
          aria-label="Favoritar imóvel"
        >
          <img
            src="/imgs/coracao.png"
            alt="Favoritar"
            className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          />
        </button>
      </div>

      {/* Preço / Carrinho / Chat */}
      <div className="flex flex-row gap-4 mt-1 items-center">
        <div className="inline-block rounded font-bold text-xl sm:text-2xl text-left overflow-hidden px-3">
          {imovel.preco}
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <button className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110">
            <img
              src="/images/icons/carrinho.png"
              alt="icone carrinho"
              className="w-4 h-4 sm:w-6 sm:h-6 md:w-6 md:h-6 object-contain"
            />
          </button>
          <button className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110">
            <img
              src="/images/icons/balao.png"
              alt="icone balão"
              className="w-4 h-4 sm:w-6 sm:h-6 md:w-6 md:h-6 object-contain"
            />
          </button>
        </div>
      </div>

      {/* Localização */}
      <div className="w-full h-7 sm:h-9 mt-2 flex items-center justify-left font-bold pl-2 whitespace-nowrap">
        {imovel.localizacao}
      </div>

      {/* Quartos e Banheiros */}
      <div className="inline-flex flex-row gap-2 mt-2">
        <div className="flex flex-col w-auto whitespace-nowrap">
          <div className="h-auto flex items-center justify-center px-2">
            <img
              src="/images/icons/quarto.png"
              alt="icone quarto"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain"
            />
          </div>
          <div className="h-auto flex items-center justify-start px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
            {imovel.quartos} Quartos
          </div>
        </div>
        <div className="flex flex-col w-auto whitespace-nowrap">
          <div className="h-auto flex items-center justify-center px-2">
            <img
              src="/images/icons/banheiro.png"
              alt="icone banheiro"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain"
            />
          </div>
          <div className="h-auto flex items-center justify-start px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
            {imovel.banheiros} Banheiros
          </div>
        </div>
      </div>

      
    </div>
  );
}
