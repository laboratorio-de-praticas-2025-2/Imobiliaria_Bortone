"use client";
import { useState } from "react";
import Image from "next/image";
import { Switch, ConfigProvider } from "antd";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import Link from "next/link";

export default function Card({banner}) {
  const [checked, setChecked] = useState(banner.ativo);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setChecked(checked);
  };

  return (
    <div className="rounded-2xl flex flex-col w-fit bg-white mb-5">
      <p className="p-3 text-lg font-bold">{banner.descricao}</p>
      <Image
        src={banner.url_imagem}
        alt={"Imagem do banner " + banner.id}
        width={425}
        height={130}
        className="aspect-[4/2] object-cover"
      />
      <div className="w-full flex justify-end gap-4 p-3">
        <div className="flex items-center gap-3">
          <p className="text-gray-500">{checked ? "Ativado" : "Desativado"}</p>
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
        <Link href={`/admin/cms-banner/editar/${banner.id}`}>
          <BiPencil
            size={22}
            className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
          />
        </Link>
        <button>
          <IoMdTrash
            size={22}
            className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}
