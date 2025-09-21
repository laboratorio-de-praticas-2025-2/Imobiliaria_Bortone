"use client";

import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import dynamic from "next/dynamic";
import Link from "next/link";
import infoContato from "@/utils/infoContato.json";

const ContatoMapa = dynamic(() => import("./ContatoMapa"), { ssr: false });

export default function Contato() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[#4C62AE] m-2 md:m-5">
        {/* Cabeçalho */}
        <div className="md:col-span-4 flex flex-col justify-start p-4">
          <p className="text-4xl md:text-5xl lg:text-7xl font-bold">CONTATO</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
            ENCONTRE INFORMAÇÕES SOBRE NOSSOS CANAIS DE ATENDIMENTO
          </p>
        </div>

        <div className="md:col-span-4 border-y border-gray-300/70 py-8 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Whatsapp */}
            <div className="flex flex-col justify-start p-4">
              <p className="text-2xl lg:text-3xl font-bold flex flex-row items-center gap-3 pb-7">
                <FaWhatsapp /> Whatsapp
              </p>
              <p className="text-xl lg:text-2xl font-light">
                {infoContato.telefoneWhats.telefone}
              </p>
              <p className="text-xl lg:text-2xl font-light">
                Ou{" "}
                <Link
                  href={infoContato.telefoneWhats.whatsapp.url}
                  target={infoContato.telefoneWhats.whatsapp.target}
                  rel={infoContato.telefoneWhats.whatsapp.rel}
                  className="underline hover:opacity-80"
                >
                  clique aqui
                </Link>{" "}
                para ser redirecionado
              </p>
            </div>

            {/* E-mail */}
            <div className="flex flex-col justify-start p-4">
              <p className="text-2xl lg:text-3xl font-bold flex flex-row items-center gap-3 pb-7">
                <MdOutlineEmail /> E-mail
              </p>
              <p className="text-xl lg:text-2xl font-light">
                <Link
                  href={`mailto:${infoContato.contato.email}`}
                  className="underline hover:opacity-80"
                >
                  {infoContato.contato.email}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="md:col-span-4 flex flex-col items-start justify-start p-4">
          <p className="text-xl md:text-2xl font-bold">
            Ou venha direto ate a Imobiliária Bortone!
          </p>
          <p className="text-lg md:text-2xl font-light">
            Nos localizamos na{" "}
            <Link
              href={infoContato.localizacao.googleMaps.url}
              target={infoContato.localizacao.googleMaps.target}
              rel={infoContato.localizacao.googleMaps.rel}
              className="underline hover:opacity-80"
            >
              {infoContato.localizacao.endereco}
            </Link>{" "}
          </p>
        </div>

        {/* Mapa */}
        <div className="md:col-span-4 flex items-center justify-center p-4 h-64 md:h-96 w-full">
          <ContatoMapa />
        </div>
      </div>
    </main>
  );
}
