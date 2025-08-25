import React from "react";

export default function Popup() {
  return (
    <div className="bg-gradient-to-t from-[#0C1121] to-[#324587] absolute flex flex-col md:flex-row items-center gap-6 p-9 rounded-4xl shadow-xl z-[9999] max-w-3xl w-[90%] mx-auto">
      {/* Botão Fechar */}
      <button className="bg-amber-50 absolute top-3 right-5 w-8 h-8 rounded-full justify-center p-2 duration-300 hover:scale-110 hover:bg-red-500">
        <img
          src="/images/icons/fechar.png"
          className="w-auto h-auto"
          alt="Fechar"
        />
      </button>

      {/* Imagem */}
      <div className="flex-shrink-1 w-1/2 justify-center">
        <img
          src="/images/casa.png"
          alt="Casa"
          className="h-40 md:h-56 w-full object-contain"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-6 text-center md:text-left">
        {/* Título */}
        <div className="text-white font-bold text-2xl">
          Novo imóvel disponível!
        </div>

        {/* Descrição */}
        <div className="text-white text-lg leading-tight text-left">
          Acabamos de adicionar um novo imóvel! Confira agora e seja um dos
          primeiros a conhecer essa oportunidade exclusiva.
        </div>

        {/* Botões */}
        <div className="flex flex-row gap-4 justify-center md:justify-start">
          <button
            className="px-6 py-3 bg-orange-500 !text-white hover:text-white font-semibold rounded-lg whitespace-nowrap
                     transition-all duration-300 transform 
                     hover:scale-105 hover:shadow-white/40">
            Veja Agora
          </button>
          <button
            className="px-6 py-3 border border-white !text-white hover:text-white font-semibold rounded-lg whitespace-nowrap
                     transition-all duration-300 transform 
                     hover:scale-105 hover:shadow-white/40 hover:bg-white/10">
            Mais Tarde
          </button>
        </div>
      </div>
    </div>
  );
}
