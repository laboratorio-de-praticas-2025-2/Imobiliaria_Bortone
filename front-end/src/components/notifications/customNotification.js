
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
  try {
    console.log(
      "🔥 CustomNotification - imovel completo:",
      JSON.stringify(imovel, null, 2)
    );
  } catch (err) {
    console.log(
      "🔥 CustomNotification - imovel completo: [unserializable]",
      err
    );
  }
  console.log("🔥 CustomNotification - imovel.property:", imovel?.property);

  // Extrair dados do imóvel - tentando várias formas
  const title = imovel?.title || "Imóvel em Destaque";
  const message = imovel?.message || "Confira este imóvel interessante!";

  // Tenta várias formas de acessar os dados da propriedade
  const property = imovel?.property || imovel?.imovel || imovel?.data || imovel;

  console.log("🔥 CustomNotification - property extraída:", property);
  console.log(
    "🔥 CustomNotification - keys do property:",
    Object.keys(property || {})
  );

  // Formatação de dados com fallbacks mais robustos
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


  // Imagem placeholder ou URL real (você pode implementar lógica para buscar imagem)
  const imagemUrl = property?.imagem_url || "/404.png";

  return (
    <div className="bg-gradient-to-t from-[#0C1121] to-[#324587] flex flex-col md:flex-row items-center gap-6 p-9 rounded-4xl shadow-xl max-w-3xl w-[90%] mx-auto relative">
      {/* Botão Fechar */}
      <button
        className="bg-amber-50 absolute top-3 right-5 w-8 h-8 rounded-full justify-center duration-300 hover:scale-110 hover:bg-red-500 flex items-center !text-[var(--primary)]"
        onClick={onClose}
      >
        <IoClose size={30} />
      </button>

      {/* Imagem */}
      <div className="flex-shrink-1 w-1/2 justify-center">
        <Image
          src={imagemUrl}
          alt={title}
          width={320}
          height={224}
          className="h-40 md:h-56 w-full object-contain"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-6 text-center md:text-left">
        <div className="text-white font-bold text-2xl">{title}</div>
        <div className="text-white text-lg leading-tight text-left">
          {message}
        </div>
        <div className="text-white text-sm">
          {endereco}
          {areaFormatada && ` • ${areaFormatada}`}
          {precoFormatado && ` • ${precoFormatado}`}
        </div>

        {/* Botões */}
        <div className="flex flex-row gap-4 justify-center md:justify-start">
          <button
            className="px-6 py-3 bg-orange-500 !text-white hover:text-white font-semibold rounded-lg whitespace-nowrap
                      transition-all duration-300 transform 
                      hover:scale-105 hover:shadow-white/40"
            onClick={() => {
              onViewNow();
              onClose();
            }}
          >
            Veja Agora
          </button>
          <button
            className="px-6 py-3 border border-white !text-white hover:text-white font-semibold rounded-lg whitespace-nowrap
                      transition-all duration-300 transform 
                      hover:scale-105 hover:shadow-white/40 hover:bg-white/10"
            onClick={onClose}
          >
            Mais Tarde
          </button>
        </div>
      </div>
    </div>
  );
}
