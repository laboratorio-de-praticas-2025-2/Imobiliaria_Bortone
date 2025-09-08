"use client";
import { useState } from "react";
import Image from "next/image";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";

export default function PostCard({ item }) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const onDelete = () => {
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = () => {
    console.log("Delete Confirmed");
    setIsConfirmModalVisible(false);
  };

  // Função para truncar o texto se for muito grande
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
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
        <p className="p-3 text-lg font-bold" title={item.titulo}>
          {truncate(item.titulo, 40)}
        </p>
        <Image
          src={item.url_imagem}
          alt={"Imagem do item " + item.id}
          width={425}
          height={130}
          className={`aspect-[4/2] object-cover w-full`}
        />
        <div className="sm:w-[60vw] w-[70vw] flex flex-col gap-3.5 p-3 md:w-full flex-1">
          <p>{truncate(item.conteudo, 260)}</p>
          <div className="w-full flex justify-end gap-4 p-3 mt-auto">
            <Link href={`/admin/cms-publicacoes/editar/${item.id}`}>
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
      </div>
    </>
  );
}
