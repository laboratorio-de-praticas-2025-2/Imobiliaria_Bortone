"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";
import { buildImageUrlWithProxy } from "@/utils/imageUtils";

export default function Card({ item, href_cms = "banner", header = false, onDelete, onToggle }) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determinar o tipo de CMS baseado na URL href_cms
  const getImageType = () => {
    const typeMap = {
      'banner': 'banner',
      'publicidades': 'publicidade', 
      'publicacoes': 'publicacao',
      'imoveis': 'imovel'
    };
    return typeMap[href_cms] || 'default';
  };

  // Determinar a URL da imagem baseada no tipo de CMS
  const getImageSrc = () => {
    // Se houve erro de carregamento, mostrar imagem 404
    if (imageError) return "/404.png";
    
    // Para publicidades, usar url_imagem; para outros, usar imagem
    const imageUrl = item.url_imagem || item.imagem;
    
    console.log('🖼️ Card Image Debug:', {
      itemId: item.id,
      imageUrl,
      type: getImageType(),
      href_cms
    });
    
    if (!imageUrl) {
      console.log('⚠️ Nenhuma URL de imagem encontrada, usando fallback');
      return "/images/casa.png";
    }
    
    // Usar utilitário unificado para construir URL
    const finalUrl = buildImageUrlWithProxy(imageUrl, getImageType());
    console.log('🔗 URL final da imagem:', finalUrl);
    return finalUrl;
  };
  
  const imageSrc = getImageSrc();

  // Handler para erro de carregamento de imagem
  const handleImageError = () => {
    console.warn(`Erro ao carregar imagem: ${item.url_imagem || item.imagem}`);
    setImageError(true);
  };

  // Reset do erro quando o item muda
  useEffect(() => {
    setImageError(false);
  }, [item.id, item.url_imagem, item.imagem]);

  const onConfirmDelete = async () => {
    if (!onDelete) {
      console.warn('⚠️ onDelete function not provided');
      return;
    }
    setIsProcessing(true);
    console.log('🗑️ Card: Iniciando delete do item', item.id);
    try {
      await onDelete();
      console.log('✅ Card: Delete concluído com sucesso');
    } catch (error) {
      console.error("❌ Card: Falha ao deletar:", error);
      alert('Erro ao deletar item: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsProcessing(false);
      setIsConfirmModalVisible(false);
    }
  };

  const handleToggle = async () => {
    if (!onToggle) {
      console.warn('⚠️ onToggle function not provided');
      return;
    }
    setIsProcessing(true);
    console.log('🔄 Card: Iniciando toggle do item', item.id, 'Status atual:', item.ativo);
    try {
      await onToggle();
      console.log('✅ Card: Toggle concluído com sucesso');
    } catch (error) {
      console.error("❌ Card: Erro ao alternar status:", error);
      alert('Erro ao alterar status: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message="Você tem certeza que deseja excluir este registro definitivamente?"
          onConfirm={onConfirmDelete}
          onCancel={() => setIsConfirmModalVisible(false)}
          isConfirming={isProcessing}
        />
      )}

      <div className="rounded-2xl flex flex-col w-fit bg-white mb-5 shadow-md">
        {header && (
          <p className="p-3 text-lg font-bold">
            [{item.id}] - {item.descricao || item.titulo}
          </p>
        )}

        <Image
          src={imageSrc}
          alt={"Imagem do item " + item.id}
          width={425}
          height={130}
          className={`aspect-[4/2] object-cover ${header ? "" : "rounded-t-2xl"}`}
          priority={imageSrc === "/images/casa.png" || imageSrc === "/404.png"} // Priority para placeholders
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ 
            width: (imageSrc === "/images/casa.png" || imageSrc === "/404.png") ? 'auto' : undefined,
            height: (imageSrc === "/images/casa.png" || imageSrc === "/404.png") ? 'auto' : undefined
          }}
          onError={handleImageError}
          unoptimized={true}
        />

        <div className="w-full flex justify-end gap-4 p-3 items-center">
          <div className="flex items-center gap-3">
            <p className="text-gray-500">{item.ativo === 1 ? "Ativado" : "Desativado"}</p>
            <ConfigProvider theme={{ token: { colorPrimary: "#7F92D4" } }}>
              <Switch
                checked={item.ativo === 1}
                onChange={handleToggle}
                loading={isProcessing}
                className="switch-cms"
              />
            </ConfigProvider>
          </div>

          <Link href={`/admin/cms-${href_cms}/editar/${item.id}`}>
            <BiPencil
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </Link>

          <button onClick={() => setIsConfirmModalVisible(true)} disabled={isProcessing}>
            <IoMdTrash
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
        </div>
      </div>
    </>
  );
}
