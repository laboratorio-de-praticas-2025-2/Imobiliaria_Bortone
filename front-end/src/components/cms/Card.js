"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";
import axios from "axios";

<<<<<<< HEAD
export default function Card({ item, href_cms = "banner", header = false, onDelete, onToggle }) {
=======
export default function Card({ item, href_cms = "banner", header = false, onDelete: onDeleteCallback, onToggle: onToggleCallback }) {
  const [checked, setChecked] = useState(item.ativo);
>>>>>>> origin/develop
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

<<<<<<< HEAD
  const imageSrc = item.imagem || "/images/casa.png";

  const onConfirmDelete = async () => {
    if (!onDelete) return;
    setIsProcessing(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("Falha ao deletar:", error);
    } finally {
      setIsProcessing(false);
      setIsConfirmModalVisible(false);
    }
  };

  const handleToggle = async () => {
    if (!onToggle) return;
    setIsProcessing(true);
    try {
      await onToggle();
    } catch (error) {
      console.error("Erro ao alternar status:", error);
    } finally {
      setIsProcessing(false);
=======
  // Debug: verificar o que está sendo passado
  console.log('Card item.url_imagem:', item.url_imagem);
  console.log('Card item.url_imagem type:', typeof item.url_imagem);
  console.log('Card item completo:', item);

  // Função para validar e sanitizar a URL da imagem
  const getValidImageSrc = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const placeholder = '/images/casa.png';

    if (!item?.url_imagem || typeof item.url_imagem !== 'string') return placeholder;

    let src = item.url_imagem.trim();

    // Normalizar caso backend salve sem barra inicial
    if (!src.startsWith('/')) {
      // Se parece já ser um nome de arquivo salvo pelo multer
      if (!src.startsWith('http')) {
        // Determinar a pasta baseada no href_cms
        const folderMap = {
          'publicidades': 'publicidadeImages',
          'banner': 'bannerImages',
          'publicacoes': 'blogImages'
        };
        const folder = folderMap[href_cms] || 'publicidadeImages';
        src = `/images/${folder}/${src}`;
      }
    }

    // Se for caminho relativo local (/images/...) precisamos usar direto em produção do Next.
    // Porém o erro 400 do _next/image pode ocorrer se a imagem não existir no momento do build ou se houver CSP bloqueando.
    // Para evitar transformação errada pelo loader, podemos usar a URL absoluta do backend se disponível.
    if (src.startsWith('/images/')) {
      // Se apiBase contém domínio (http) e não é o mesmo host do frontend (deploy vercel), usar absoluto.
      if (apiBase.startsWith('http')) {
        // Evitar dupla barra
        const normalizedBase = apiBase.replace(/\/$/, '');
        return `${normalizedBase}${src}`;
      }
      return src; // fallback
    }

    return src;
  };

  const onDelete = () => {
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = async () => {
    try {
      // Mapear href_cms para o endpoint correto
      const endpointMap = {
        'publicidades': 'publicidade',
        'banner': 'banner',
        'publicacoes': 'publicacoes'
      };
      
      const endpoint = endpointMap[href_cms] || href_cms;
      const itemType = href_cms === 'banner' ? 'Banner' : href_cms === 'publicacoes' ? 'Publicação' : 'Publicidade';
      
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${item.id}`);
      if (response.status === 204) {
        alert(`${itemType} excluído(a) com sucesso!`);
        setIsConfirmModalVisible(false);
        if (onDeleteCallback) {
          onDeleteCallback();
        }
      } else {
        alert(`Erro inesperado ao excluir ${itemType.toLowerCase()}`);
        setIsConfirmModalVisible(false);
      }
    } catch (error) {
      console.log(`Erro ao excluir ${itemType.toLowerCase()}:`, error);
      alert(`Erro ao excluir ${itemType.toLowerCase()}`);
      setIsConfirmModalVisible(false);
    }
  };

  const onChange = async (checked) => {
    try {
      // Mapear href_cms para o endpoint correto
      const endpointMap = {
        'publicidades': 'publicidade',
        'banner': 'banner',
        'publicacoes': 'publicacoes'
      };
      
      const endpoint = endpointMap[href_cms] || href_cms;
      
      // Para banners, usar rota específica de toggle
      let response;
      if (href_cms === 'banner') {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${item.id}/toggle`);
      } else {
        response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${item.id}`, { ativo: checked });
      }
      
      if (response.status === 200) {
        setChecked(checked);
        if (onToggleCallback) {
          onToggleCallback();
        }
      }
    } catch (error) {
      const itemType = href_cms === 'banner' ? 'banner' : href_cms === 'publicacoes' ? 'publicação' : 'publicidade';
      console.log(`Erro ao alterar status do ${itemType}:`, error);
>>>>>>> origin/develop
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
<<<<<<< HEAD
          src={imageSrc}
=======
          src={getValidImageSrc()}
>>>>>>> origin/develop
          alt={"Imagem do item " + item.id}
          width={425}
          height={130}
          className={`aspect-[4/2] object-cover ${header ? "" : "rounded-t-2xl"}`}
<<<<<<< HEAD
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
=======
          onError={(e) => {
            // fallback se a imagem não carregar (erro 400 ou 404)
            try {
              e.target.src = '/images/casa.png';
            } catch {}
          }}
        />
        <div className="w-full flex justify-end gap-4 p-3">
          <div className="flex items-center gap-3">
            <p className="text-gray-500">
              {checked ? "Ativado" : "Desativado"}
            </p>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#7F92D4",
                  colorPrimaryBorder: "#7F92D4",
                  colorPrimaryHover: "#5C6BC0",
                },
              }}
            >
              <Switch
                checked={checked}
                onChange={onChange}
>>>>>>> origin/develop
                className="switch-cms"
              />
            </ConfigProvider>
          </div>
<<<<<<< HEAD

=======
>>>>>>> origin/develop
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