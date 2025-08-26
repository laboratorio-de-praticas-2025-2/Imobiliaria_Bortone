"use client";
import { Divider } from "antd";
import CTACard from "@/components/home/CTACard";
import Header from "@/components/home/Header";
import PropriedadesSelecionadas from "@/components/home/PropriedadesSelecionadas";
import PropriedadesPerto from "@/components/home/PropriedadesPerto";
import HomeFooter from "@/components/home/HomeFooter";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";

const isLoggedIn = false;

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const timer1 = setTimeout(() => setAnimateOut(true), 2000);
      const timer2 = setTimeout(() => setShowSplash(false), 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen animateOut={animateOut} />;
  }

  return (
    <>
      <Header />
      <Divider size="large" />
      <div className="ctacards flex gap-10 md:px-16 md:py-7 px-6 py-8 md:flex-row flex-col">
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
