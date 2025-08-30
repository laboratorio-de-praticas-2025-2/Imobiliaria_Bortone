"use client";
import { useState } from "react";
import { Button, Flex, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/constants/navLinks";
import { FaUser } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { createElement } from "react";

const { Search } = Input;

const onSearch = (value) => console.log(value);

export default function HomeNavbar({className}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`navbar top-0 left-0 w-full z-10 bg-white md:bg-[#050D2D73] py-3.5 px-6 md:px-16 ${className}`}>
      <Flex justify="space-between" align="center" className="navbar-desktop">
        {/* Logo */}
        <Image
          src="/images/LogoPreta.svg"
          alt="Logo Bortone"
          width={113}
          height={43}
        />

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <Flex gap="middle" align="center" className="nav-link">
                {link.name}
              </Flex>
            </Link>
          ))}
        </div>

        <Button
          variant="outlined"
          icon={<FaUser />}
          shape="round"
          className="btn-login"
          href="/bem-vindo"
        >
          Entrar
        </Button>
      </Flex>

      <Flex gap="large" align="center" className="navbar-mobile">
        <button className="md:hidden text-2xl" onClick={() => setOpen(true)}>
          <FaBars color="#304383" />
        </button>

        {/* Logo */}
        <Image
          src="/images/LogoAzul.svg"
          alt="Logo Bortone"
          width={113}
          height={43}
        />
      </Flex>

      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white shadow-lg transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-8 p-4 border-b border-gray-300">
          <Flex justify="space-between" align="center" className="w-full">
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={113}
              height={43}
            />
          </Flex>
          <Flex vertical gap="middle">
            <p className="text-sm text-[var(--primary)]">
              Faça login para conferir imóveis disponíveis na sua região,
              visitas, propostas e contatos
            </p>
            <Button
              type="primary"
              shape="round"
              className="w-full entrar-btn-mobile"
              href="/bem-vindo"
            >
              Entrar
            </Button>
          </Flex>
        </div>

        <div className="flex flex-col p-6 gap-6">
          {/* Search input mobile */}
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
