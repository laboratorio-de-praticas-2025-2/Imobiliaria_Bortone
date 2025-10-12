"use client";
import { IoClose } from "react-icons/io5";
import React from "react";
import Image from "next/image";

export default function CustomNotification({
  toast,
  imovel,
  tipo,
  onViewNow,
  onClose,
}) {
  // 🔍 DEBUG: Vamos ver exatamente o que está chegando
  console.log("🔥 CustomNotification - Props recebidas:", {
    toast,
    imovel,
    tipo,
  });

  // Extrair dados do imóvel
  const title = imovel?.title || "Imóvel em Destaque";
  const message = imovel?.message || "Confira este imóvel interessante!";
  const property = imovel?.property || imovel?.imovel || imovel?.data || imovel;

  console.log("🔥 CustomNotification - property extraída:", property);

  // Formatação de dados
  const preco = property?.preco || property?.valor || property?.price;
  const precoFormatado = preco
    ? `R$ ${parseFloat(preco).toLocaleString("pt-BR")}`
    : "Consulte";

  const area = property?.area || property?.metragem || property?.size;
  const areaFormatada = area ? `${area}m²` : "";

  const endereco =
    property?.endereco ||
    property?.address ||
    `${property?.cidade || ""} ${property?.bairro || ""}`.trim() ||
    "Endereço não informado";

  const tipoNegociacao =
    property?.tipo_negociacao || property?.tipo || property?.type || "venda";
  const id = property?.id || property?.imovel_id;

  console.log("🔥 CustomNotification - Dados processados:", {
    precoFormatado,
    areaFormatada,
    endereco,
    tipoNegociacao,
    id,
  });

  // Imagem
  const imagemUrl = property?.imagem_url || "/images/casa.png";

  return (
    <div className={`
            relative w-[420px] max-w-[90vw] 
            bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700
            rounded-2xl p-1 shadow-2xl
            transform transition-all duration-300 ease-out
           ${toast?.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
      {/* Container interno branco */}
      <div className="bg-white rounded-xl p-4 relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center
                             text-gray-400 hover:text-gray-600 hover:bg-gray-100
                             rounded-full transition-all duration-200 z-10"
        >
          <IoClose size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-3 pr-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 
                                  rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-lg">🏠</span>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold text-sm leading-tight">
              {title}
            </h3>
            <span className="text-blue-600 text-xs uppercase font-medium">
              {tipoNegociacao}
            </span>
          </div>
        </div>

        {/* Imagem do imóvel */}
        <div className="relative w-full h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {imagemUrl && imagemUrl !== "images/casa.png" ? (
            <Image
              src={imagemUrl}
              alt={title}
              fill
              className="object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            // Placeholder quando não há imagem real
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 
                       flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl">🏠</span>
                <div className="text-xs text-gray-500 mt-1">Imóvel em destaque</div>
              </div>
            </div>
          )}

          {/* Overlay com preço */}
          <div className="absolute top-2 left-2 bg-black/80 text-white 
                                  px-2 py-1 rounded text-xs font-semibold">
            {precoFormatado}
          </div>

          {/* Área */}
          {areaFormatada && (
            <div className="absolute top-2 right-2 bg-blue-600/90 text-white 
                                      px-2 py-1 rounded text-xs font-medium">
              {areaFormatada}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
            {message}
          </p>

          <div className="flex items-center text-gray-500 text-xs">
            <span className="mr-1">📍</span>
            <span className="truncate">{endereco}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onViewNow(id);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 
                                 text-white font-medium py-2.5 px-4 rounded-lg text-sm
                                 hover:from-blue-700 hover:to-purple-700
                                 transform hover:scale-[1.02] transition-all duration-200
                                 hover:shadow-lg"
          >
            Ver Imóvel
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 
                                 font-medium rounded-lg text-sm
                                 hover:bg-gray-50 hover:border-gray-300
                                 transition-all duration-200"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  );
}