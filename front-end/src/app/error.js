"use client";
import { useEffect } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Image from "next/image";

export default function Error({ error }) {
  useEffect(() => {
    console.error("Erro detectado:", error);
    document.title = "Erro interno | Meu Site";
  }, [error]);

  return (
    <>
      <HomeNavbar />
      <div className="sidebar-desk flex flex-col items-center justify-center px-4">
        <div className="flex md:flex-row flex-col items-center justify-center">
          <div className="flex flex-col justify-center gap-20 md:w-[50%]">
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo"
              width={300}
              height={300}
            />
            <p className="text-5xl text-[var(--primary)]">
              <span className="font-bold">Erro</span> 500
            </p>
            <p className="text-[var(--primary)] text-2xl">
              Ops! Algo deu errado no servidor. Por favor, entre em contato com
              o suporte ou tente novamente mais tarde.
            </p>
          </div>
          <Image src="/images/erro.svg" alt="Erro" width={300} height={300} />
        </div>
      </div>
    </>
  );
}
