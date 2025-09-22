import { Flex } from "antd";
import Image from "next/image";
import Link from "next/link";
import infoContato from "@/utils/infoContato.json";

export default function HomeFooter() {
  return (
    <footer className="home-footer relative md:pt-20 ">
      <Image
        src="/images/dudaShop.svg"
        alt="dudaShop"
        width={1200}
        height={100}
        className="w-full h-auto md:px-16 md:py-7 px-4"
      />
      <div className="home-footer-content flex md:flex-row flex-col md:justify-between justify-end gap-14 px-16 py-7 text-white items-end md:pb-28">
        <Flex vertical gap="large">
          <p className="text-xl font-bold">Contate-nos</p>
          <Flex vertical gap="middle">
            <p>
              <Link
                href={infoContato.telefoneWhats.whatsapp.url}
                target={infoContato.telefoneWhats.whatsapp.target}
                rel={infoContato.telefoneWhats.whatsapp.rel}
              >
                {infoContato.telefoneWhats.telefone}
              </Link>
            </p>
            <p>
              <Link href={`mailto:${infoContato.contato.email}`}>
                {infoContato.contato.email}
              </Link>
            </p>
            <p>Atendimento de seg. à sex. - 09:00 às 18:00</p>
          </Flex>
        </Flex>
        <Flex vertical gap="large">
          <p className="text-xl font-bold">Sobre nós</p>
          <Flex vertical gap="middle">
            <p>Grupo Bortone</p>
            <p>CNPJ 26.196.890/0001-42</p>
            <p>
              <Link
                href={infoContato.localizacao.googleMaps.url}
                target={infoContato.localizacao.googleMaps.target}
                rel={infoContato.localizacao.googleMaps.rel}
              >
                {infoContato.localizacao.endereco}
              </Link>
            </p>
          </Flex>
        </Flex>
        <Image
          src="/images/LogoPreta.svg"
          alt="Logo Bortone"
          width={260}
          height={100}
          className="md:flex hidden"
        />
      </div>
    </footer>
  );
}
