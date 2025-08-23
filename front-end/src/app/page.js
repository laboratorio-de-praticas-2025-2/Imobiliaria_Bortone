"use client";
import { Divider } from "antd";
import CTACard from "@/components/home/CTACard";
import Header from "@/components/home/Header";
import PropriedadesSelecionadas from "@/components/home/PropriedadesSelecionadas";
import PropriedadesPerto from "@/components/home/PropriedadesPerto";
import HomeFooter from "@/components/home/HomeFooter";

const isLoggedIn = false;

export default function Home() {
  return (
    <>
      <Header />
      <Divider size="large" />
      <div className="ctacards flex gap-10 px-16 py-7 md:flex-row flex-col">
        <CTACard
          title="Faça sua proposta"
          description="Gostou de um imóvel? Faça uma proposta de valor e siga para as próximas etapas!"
          buttonText="Fazer Proposta"
          className="lg:w-[75%] md:w-[50%]"
        />
        <CTACard
          title="Fale com alguém"
          description="Não sabe como prosseguir? Seja atendido via chat!"
          buttonText="Abrir chat"
          className="lg:w-[25%] md:w-[50%]"
        />
      </div>
      <Divider size="large" />
      {isLoggedIn ? <PropriedadesSelecionadas /> : <PropriedadesPerto />}
      <Divider size="large" />

      <HomeFooter />
    </>
  );
}
