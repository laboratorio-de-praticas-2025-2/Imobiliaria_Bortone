"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";

export default function Card({ item, href_cms = "banner", header = false, onDelete, onToggle }) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
