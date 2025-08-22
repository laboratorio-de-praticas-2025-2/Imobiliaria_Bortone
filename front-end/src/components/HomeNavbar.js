import { Button, Flex, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa6";
import { navLinks } from "@/constants/navLinks";
import { FaUser } from "react-icons/fa6";

export default function HomeNavbar() {
  return (
    <div className="navbar top-0 left-0 w-full z-10 bg-[#050D2D73] py-3.5 px-16">
      <Flex justify="space-between" align="center">
        <Image
          src="/images/LogoPreta.svg"
          alt="Logo Bortone"
          width={113}
          height={43}
        />
        <Space size={55}>
          {navLinks.map((link) => (
            <Link
              href={link.path}
              style={{ textDecoration: "none" }}
              key={link.name}
            >
              <Flex gap="middle" align="center" className="nav-link">
                {link.name}
                <FaAngleDown />
              </Flex>
            </Link>
          ))}
        </Space>

        <Button variant="outlined" icon={<FaUser />} shape="round" className="btn-login">
          Entrar
        </Button>
      </Flex>
    </div>
  );
}
