"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";
import axios from "axios";

export default function Card({ item, href_cms = "banner", header = false, onDelete: onDeleteCallback, onToggle: onToggleCallback }) {
  const [checked, setChecked] = useState(item.ativo);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // Debug: verificar o que está sendo passado
  console.log('Card item.url_imagem:', item.url_imagem);
  console.log('Card item.url_imagem type:', typeof item.url_imagem);
  console.log('Card item completo:', item);

  // Função para validar e sanitizar a URL da imagem
  const getValidImageSrc = () => {
    if (!item.url_imagem || 
        item.url_imagem === null || 
        item.url_imagem === "" || 
        item.url_imagem === "null" ||
        typeof item.url_imagem !== 'string') {
      return "/images/casa.png";
    }
    
    // Se já começa com /, usar diretamente
    if (item.url_imagem.startsWith('/')) {
      return item.url_imagem;
    }
    
    // Se não começa com /, adicionar o prefixo
    return `/images/publicidadeImages/${item.url_imagem}`;
  };

  const onDelete = () => {
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/publicidade/${item.id}`);
      if (response.status === 204) {
        alert("Publicidade excluída com sucesso!");
        setIsConfirmModalVisible(false);
        if (onDeleteCallback) {
          onDeleteCallback();
        }
      } else {
        alert("Erro inesperado ao excluir a publicidade");
        setIsConfirmModalVisible(false);
      }
    } catch (error) {
      console.log("Erro ao excluir a publicidade:", error);
      alert("Erro ao excluir a publicidade");
      setIsConfirmModalVisible(false);
    }
  };

  const onChange = async (checked) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/publicidade/${item.id}`, { ativo: checked });
      if (response.status === 200) {
        setChecked(checked);
        if (onToggleCallback) {
          onToggleCallback();
        }
      }
    } catch {
      console.log("Erro ao alterar status da publicidade");
    }
  };

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message="Você tem certeza que deseja excluir o registro definitivamente?"
          onConfirm={onConfirmDelete}
          onCancel={() => setIsConfirmModalVisible(false)}
        />
      )}
      <div className="rounded-2xl flex flex-col w-fit bg-white mb-5">
        {header && (
          <p className="p-3 text-lg font-bold">
            [{item.id}] - {item.descricao || item.titulo}
          </p>
        )}
        <Image
          src={getValidImageSrc()}
          alt={"Imagem do item " + item.id}
          width={425}
          height={130}
          className={`aspect-[4/2] object-cover ${header ? "" : "rounded-t-2xl"}`}
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
          <button onClick={onDelete}>
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