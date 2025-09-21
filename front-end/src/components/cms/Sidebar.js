"use client";
import Image from "next/image";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import SidebarNav from "./SidebarNav";
import Link from "next/link";
import { usersMock } from "@/mock/users"; // Certifique-se que o caminho do import está correto

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Estados e variáveis para o botão do usuário
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = usersMock[0] || null;
  const isLoggedIn = !!user;
  const buttonHeightPX = 40;
  const bottomRadius = "20px";
  const delays = ["0ms", "60ms", "120ms"];

  return (
    <>
      {/* Sidebar compacta (Navbar Mobile) */}
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

          {/* ======================= BOTÃO DO USUÁRIO (NOVA ABORDAGEM) ======================= */}
          <div className="md:hidden ml-auto"> {/* A classe ml-auto força o alinhamento à direita */}
            {isLoggedIn && ( // Usamos '&&' para simplificar, já que não há caso 'else'
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="bg-[#EEF0F9] px-4 py-2 rounded-full cursor-pointer whitespace-nowrap flex items-center gap-1 relative z-[10000]"
                  style={{ color: "#304383" }}
                >
                  <span className="truncate">{user.nome}</span>
                  <IoIosArrowDown />
                </button>

                {/* Dropdown */}
                <ul
                  className={`absolute right-0 top-0 min-w-full bg-white shadow-lg z-[9999] 
                             transition-all duration-300 ease-out 
                             ${
                               userMenuOpen
                                 ? "opacity-100 translate-y-0"
                                 : "opacity-0 -translate-y-2 pointer-events-none"
                             }`}
                  style={{
                    paddingTop: buttonHeightPX,
                    borderRadius: bottomRadius,
                  }}
                >
                  {user.nivel === "administrador" && (
                    <Link href={"/admin/dashboard"}>
                      <li
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center flex justify-center items-center transition-all duration-300 ease-out
                                  ${ userMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2" }`}
                        style={{ color: "#304383", transitionDelay: delays[1] }}
                      >
                        CMS
                      </li>
                    </Link>
                  )}
                  <Link href={"/bem-vindo"}>
                    <li
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center flex justify-center items-center transition-all duration-300 ease-out
                                ${ userMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2" }`}
                      style={{
                        color: "#304383",
                        borderBottomLeftRadius: bottomRadius,
                        borderBottomRightRadius: bottomRadius,
                        transitionDelay: user.nivel === "administrador" ? delays[2] : delays[1],
                      }}
                    >
                      Sair
                    </li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
          {/* ======================= FIM DO BOTÃO DO USUÁRIO ======================= */}
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
            <SidebarNav />
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Logo Bortone"
                width={50}
                height={50}
                className="object-contain md:flex hidden"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}