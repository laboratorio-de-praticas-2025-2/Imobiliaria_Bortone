"use client";
import { Divider } from "antd";
import Header from "@/components/home/Header";
import PropriedadesSelecionadas from "@/components/home/PropriedadesSelecionadas";
import PropriedadesPerto from "@/components/home/PropriedadesPerto";
import HomeFooter from "@/components/home/HomeFooter";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";

const isLoggedIn = true;

export default function Home() {
  // SEO para página inicial
  useSEO(getSEOConfig('/'));
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
      {isLoggedIn ? <PropriedadesSelecionadas /> : <PropriedadesPerto />}
      <Divider size="large" />
      <HomeFooter />
    </>
  );
}
