"use client";
import Image from "next/image";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar compacta */}
      {!isOpen && (
        <div className="fixed top-0 left-0 md:h-full md:w-20 w-full bg-white md:bg-gradient-to-b md:from-[#2E3F7C] md:to-[#0C1121] flex md:flex-col md:justify-between gap-6 items-center md:py-6 py-3 md:px-0 px-6 z-50">
          <button onClick={() => setIsOpen(true)} className="cursor-pointer">
            <IoMenu size={30} className="md:text-white text-[var(--primary)]" />
          </button>
          <Image
            src="/images/logo.svg"
            alt="Logo Bortone"
            width={50}
            height={50}
            className="object-contain md:flex hidden"
          />
          <Image
            src="/images/LogoAzul.svg"
            alt="Logo Bortone"
            width={60}
            height={60}
            className="w-20 md:hidden"
          />
        </div>
      )}

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar expandida */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-full md:w-64 w-[80%] bg-white md:bg-gradient-to-b md:from-[#2E3F7C] md:to-[#0C1121] flex flex-col justify-between py-6 z-50 animate-slide-in md:border-r-0 border-r-[var(--secondary)] border-r-4">
          {/* Header com botão fechar */}
          <div>
            <div className="flex justify-between items-center px-6">
              <button onClick={() => setIsOpen(false)}>
                <IoClose
                  size={35}
                  className="md:text-white text-[var(--primary)] md:flex hidden"
                />
                <Image
                  src="/images/LogoAzul.svg"
                  alt="Logo Bortone"
                  width={60}
                  height={60}
                  className="w-20 md:hidden"
                />
              </button>
            </div>

            {/* Menu */}
            <SidebarNav />
          </div>

          {/* Logo embaixo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Logo Bortone"
              width={50}
              height={50}
              className="object-contain md:flex hidden"
            />
          </div>
        </div>
      )}
    </>
  );
}
