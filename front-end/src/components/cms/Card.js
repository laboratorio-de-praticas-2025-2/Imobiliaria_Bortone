"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";

export default function Card({ item, href_cms = "banner", header = false }) {
  const [checked, setChecked] = useState(item.ativo);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const onDelete = () => {
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = () => {
    console.log("Delete Confirmed");
    setIsConfirmModalVisible(false);
  };

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setChecked(checked);
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
            {item.descricao || item.titulo}
          </p>
        )}
        <Image
          src={item.url_imagem}
          alt={"Imagem do item " + item.id}
          width={425}
          height={130}
          className={`aspect-[4/2] object-cover ${
            header ? "" : "rounded-t-2xl"
          }`}
        />
        <div className="w-full flex justify-end gap-4 p-3">
          {item.ativo !== undefined && (
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
          )}
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
