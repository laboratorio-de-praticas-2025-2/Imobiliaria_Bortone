"use client";

import { navLinks } from "@/mock/navLinks";
import { Button, Flex, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, createElement } from "react";
import { FaBars } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { usersMock } from "@/mock/users";
import { IoIosArrowDown } from "react-icons/io";

const { Search } = Input;
const onSearch = (value) => console.log(value);

export default function HomeNavbar({ className }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = usersMock[0] || null;
  const isLoggedIn = !!user;

  const buttonHeightPX = 40;
  const bottomRadius = "20px";
  const delays = ["0ms", "60ms", "120ms"];

  return (
    <div
      className={`navbar top-0 left-0 w-full z-10 bg-white md:bg-[#050D2D73] py-3.5 px-6 md:px-16 ${className}`}
    >
      {/* Navbar Desktop */}
      <Flex
        justify="space-between"
        align="center"
        className="hidden md:flex navbar-desktop"
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/LogoPreta.svg"
            alt="Logo Bortone"
            width={113}
            height={43}
          />
        </Link>

        {/* Links de navegação */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.name} className="h-full">
              <Flex
                gap="middle"
                align="center"
                justify="center"
                className="nav-link !w-[7vw] !py-2.5 rounded-[3px] hover:!bg-white hover:!text-[var(--primary)] transition-colors"
              >
                {link.name}
              </Flex>
            </Link>
          ))}
        </div>

        {/* Botões lado a lado */}
        <div className="flex items-center gap-2 relative">
          {/* Botão "Contate-nos" */}
          <button className="pl-5">
            <Link
              href="https://wa.me/9999" // substitua pelo número
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border-2 border-white bg-transparent
                         !text-white hover:!bg-white hover:!text-[#304383] transition-colors duration-200
                         whitespace-nowrap flex-shrink-0 min-w-[130px] text-sm md:text-base
                         flex items-center justify-center no-underline"
              style={{ height: "40px" }}
            >
              Contate-nos
            </Link>
          </button>

          {/* Botão do usuário */}
          {isLoggedIn ? (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="bg-[#EEF0F9] px-4 py-2 rounded-full cursor-pointer whitespace-nowrap flex items-center gap-1 relative z-[10000]"
                style={{ color: "#304383", height: buttonHeightPX }}
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
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center
                                  flex justify-center items-center transition-all duration-300 ease-out
                                  ${
                                    userMenuOpen
                                      ? "opacity-100 translate-y-0"
                                      : "opacity-0 -translate-y-2"
                                  }`}
                      style={{
                        color: "#304383",
                        transitionDelay: delays[1],
                      }}
                    >
                      CMS
                    </li>
                  </Link>
                )}

                <Link href={"/bem-vindo"}>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center
                                flex justify-center items-center transition-all duration-300 ease-out
                                ${
                                  userMenuOpen
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-2"
                                }`}
                    style={{
                      color: "#304383",
                      borderBottomLeftRadius: bottomRadius,
                      borderBottomRightRadius: bottomRadius,
                      transitionDelay:
                        user.nivel === "administrador" ? delays[2] : delays[1],
                    }}
                  >
                    Sair
                  </li>
                </Link>
              </ul>
            </div>
          ) : (
            <Button
              variant="outlined"
              icon={<FaUser />}
              shape="round"
              className="btn-login whitespace-nowrap"
              href="/bem-vindo"
            >
              Entrar
            </Button>
          )}
        </div>
      </Flex>

      {/* Navbar Mobile */}
      <Flex
        justify="space-between"
        align="center"
        className="flex md:hidden navbar-mobile"
      >
        <Flex align="center" gap="large">
          <button className="text-2xl" onClick={() => setOpen(true)}>
            <FaBars color="#304383" />
          </button>
          <Link href="/">
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={113}
              height={43}
            />
          </Link>
        </Flex>

        <div className="flex-shrink-0">
          {isLoggedIn ? (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="bg-[#EEF0F9] px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1 cursor-pointer relative z-[10000]"
                style={{ color: "#304383", height: buttonHeightPX }}
              >
                <span className="truncate">{user.nome}</span>
                <IoIosArrowDown />
              </button>

              {/* Dropdown Mobile */}
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
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center
                                  flex justify-center items-center transition-all duration-300 ease-out
                                  ${
                                    userMenuOpen
                                      ? "opacity-100 translate-y-0"
                                      : "opacity-0 -translate-y-2"
                                  }`}
                      style={{
                        color: "#304383",
                        transitionDelay: delays[1],
                      }}
                    >
                      CMS
                    </li>
                  </Link>
                )}

                <Link href={"/bem-vindo"}>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center
                                flex justify-center items-center transition-all duration-300 ease-out
                                ${
                                  userMenuOpen
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-2"
                                }`}
                    style={{
                      color: "#304383",
                      borderBottomLeftRadius: bottomRadius,
                      borderBottomRightRadius: bottomRadius,
                      transitionDelay:
                        user.nivel === "administrador" ? delays[2] : delays[1],
                    }}
                  >
                    Sair
                  </li>
                </Link>
              </ul>
            </div>
          ) : (
            <Button
              variant="outlined"
              icon={<FaUser />}
              shape="round"
              className="whitespace-nowrap"
              href="/bem-vindo"
            >
              Entrar
            </Button>
          )}
        </div>
      </Flex>

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white shadow-lg transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-6 p-4 border-b border-gray-300">
          {/* Logo */}
          <Flex justify="space-between" align="center" className="w-full">
            <Link href="/">
              <Image
                src="/images/LogoAzul.svg"
                alt="Logo Bortone"
                width={113}
                height={43}
              />
            </Link>
          </Flex>

          {/* Botão "Contate-nos" - Mobile */}
          <Link
            href="https://wa.me/9999" // substitua pelo número
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border-2 border-[#304383] bg-transparent 
                       text-[#304383] hover:!bg-[#304383] hover:!text-white transition-colors duration-200
                       whitespace-nowrap flex-shrink-0 min-w-[130px] text-base
                       flex items-center justify-center no-underline "
            style={{ height: "40px" }}
          >
            Contate-nos
          </Link>
        </div>

        <div className="flex flex-col p-6 gap-6">
          <Search
            placeholder="Pesquisa"
            onSearch={onSearch}
            style={{ width: "100%" }}
            allowClear
            className="nav-search-mobile"
          />

          {navLinks.map((link) => (
            <Link
              href={link.path}
              key={link.name}
              onClick={() => setOpen(false)}
              className="text-xl text-[var(--primary)] flex items-center gap-4"
            >
              {link.icon && createElement(link.icon)}
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
