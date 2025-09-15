"use client";
import { navLinks } from "@/mock/navLinks";
import { Button, Flex, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { createElement, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { usersMock } from "@/mock/users";
import { IoIosArrowDown } from "react-icons/io";

const { Search } = Input;
const onSearch = (value) => console.log(value);

export default function HomeNavbar({ className }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Altere para userMock[null] para simular deslogado, userMock[1] = usuário comum
  const user = usersMock[0] || null;
  const isLoggedIn = !!user;

  const buttonHeightPX = 40;
  const topRadius = "20px";
  const bottomRadius = "20px";

  // Stagger: delays para cada item do dropdown
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
        <Link href="/">
          <Image
            src="/images/LogoPreta.svg"
            alt="Logo Bortone"
            width={113}
            height={43}
          />
        </Link>

        <div className="flex items-center gap-10">
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

        {isLoggedIn ? (
          <div className="relative inline-block text-left">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="bg-[#EEF0F9] px-4 py-2 rounded-full cursor-pointer whitespace-nowrap flex items-center gap-1 relative z-[10000]"
              style={{ color: "#304383" }}
            >
              <span className="truncate">{user.nome}</span>
              <IoIosArrowDown />
            </button>

            {/* Dropdown - botão sempre acima */}
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
              <li
                className={`px-4 py-2 h-[30px] hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center 
                            flex justify-center items-center transition-all duration-300 ease-out
                            ${
                              userMenuOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2"
                            }`}
                style={{
                  color: "#304383",
                  borderTopLeftRadius: topRadius,
                  borderTopRightRadius: topRadius,
                  transitionDelay: delays[0],
                }}
              >
                Perfil
              </li>
              {user.nivel === "administrador" && (
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
              )}
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
                style={{ color: "#304383" }}
              >
                <span className="truncate">{user.nome}</span>
                <IoIosArrowDown />
              </button>

              {/* Dropdown Mobile - botão sempre acima */}
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
                <li
                  className={`px-4 py-2 h-[30px] hover:bg-gray-100 cursor-pointer whitespace-nowrap text-center 
                              flex justify-center items-center transition-all duration-300 ease-out
                              ${
                                userMenuOpen
                                  ? "opacity-100 translate-y-0"
                                  : "opacity-0 -translate-y-2"
                              }`}
                  style={{
                    color: "#304383",
                    borderTopLeftRadius: topRadius,
                    borderTopRightRadius: topRadius,
                    transitionDelay: delays[0],
                  }}
                >
                  Perfil
                </li>
                {user.nivel === "administrador" && (
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
                )}
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
        <div className="flex flex-col gap-8 p-4 border-b border-gray-300">
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
          <Flex vertical gap="middle">
            <p className="text-sm text-[var(--primary)]">
              Faça login para conferir imóveis disponíveis na sua região,
              visitas, propostas e contatos
            </p>
            {!isLoggedIn && (
              <Button
                type="primary"
                shape="round"
                className="w-full entrar-btn-mobile"
                href="/bem-vindo"
              >
                Entrar
              </Button>
            )}
          </Flex>
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
              {createElement(link.icon)}
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
