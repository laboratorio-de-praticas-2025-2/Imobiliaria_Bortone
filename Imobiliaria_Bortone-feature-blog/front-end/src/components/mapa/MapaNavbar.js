"use client";
import { Button, Flex } from "antd";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/constants/navLinks";
import { FaUser } from "react-icons/fa6";

export default function MapaNavbar() {
  return (
    <div className="navbar top-0 left-0 w-full z-10 bg-white py-3.5 px-6 md:px-16 hidden md:flex justify-between">
        {/* Logo */}
        <Image
          src="/images/LogoAzul.svg"
          alt="Logo Bortone"
          width={113}
          height={43}
        />

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <Flex gap="middle" align="center" className="nav-mapa-link">
                {link.name}
              </Flex>
            </Link>
          ))}
        </div>

        <Button
          variant="outlined"
          icon={<FaUser />}
          shape="round"
          className="btn-login-map"
          href="/bem-vindo"
        >
          Entrar
        </Button>
    </div>
  );
}
