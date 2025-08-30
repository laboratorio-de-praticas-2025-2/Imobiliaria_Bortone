/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";

export default function CardMapa({ imovel }) {
  return (
    <div
      key={imovel.id}
      className="group shrink-0 min-w-[260px] sm:min-w-[260px] lg:min-w-[280px] h-auto p-4 
      border-0 rounded-lg shadow-lg bg-white transform transition-transform duration-300 hover:scale-105"
    >
      {/* Imagem do imóvel */}
      <div className="w-full h-28 sm:h-36 border-0 rounded-lg overflow-hidden relative">
        <img
          src={imovel.imagem}
          alt={`Imagem do imóvel ${imovel.id}`}
          className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Preço / Carrinho / Chat */}
      <div className="flex flex-row gap-4 mt-1 items-center">
        <div className="inline-block rounded font-bold text-xl sm:text-2xl text-left overflow-hidden px-3">
          R$ {imovel.preco.toLocaleString()}
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <button className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110">
            <FaShoppingCart className="text-[var(--primary)]" />
          </button>
          <button className="flex items-center justify-center rounded p-1 transition duration-200 ease-in-out hover:scale-110 hover:brightness-110">
            <RiMessage2Fill className="text-[var(--primary)]" />
          </button>
        </div>
      </div>

      {/* Localização */}
      <div className="w-full h-7 sm:h-9 mt-2 flex items-center justify-left font-bold pl-2 whitespace-nowrap">
        {imovel.endereco}
      </div>

      {/* Quartos e Banheiros */}
      <div className="inline-flex flex-row gap-2 mt-2">
        <div className="flex flex-col w-auto whitespace-nowrap">
          <div className="h-auto flex items-center justify-center px-2">
            <BsDoorOpenFill />
          </div>
          <div className="h-auto flex items-center justify-start px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
            {imovel.quartos} Quartos
          </div>
        </div>
        <div className="flex flex-col w-auto whitespace-nowrap">
          <div className="h-auto flex items-center justify-center px-2">
            <PiBathtub />
          </div>
          <div className="h-auto flex items-center justify-start px-2 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
            {imovel.banheiros} Banheiros
          </div>
        </div>
      </div>
    </div>
  );
}
