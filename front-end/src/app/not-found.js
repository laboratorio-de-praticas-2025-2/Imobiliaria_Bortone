"use client";
import { useEffect } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Image from "next/image";

export default function NotFound() {
  useEffect(() => {
    document.title = "Página não encontrada | Meu Site";
  }, []);
  
  return (
    <>
      <HomeNavbar />
      <div className="sidebar-desk flex flex-col items-center justify-center px-4">
        <div className="flex flex-col justify-center gap-11">
          <Image
            src="/images/LogoAzul.svg"
            alt="Logo"
            width={300}
            height={300}
          />
          <p className="text-5xl text-[var(--primary)]">
            <span className="font-bold">Erro</span> 404
          </p>
          <p className="text-[var(--primary)] text-2xl">
            A página que você está tentando acessar não está disponível ou pode
            ter sido movida.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#2C3E99] px-6 py-2 rounded-full hover:bg-[#223173] transition font-medium shadow-md w-fit"
          >
            <p className="text-white">
                Voltar para a página inicial
            </p>
          </button>
        </div>
      </div>
    </>
  );
}