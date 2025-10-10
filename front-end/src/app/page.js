"use client";
import { Divider } from "antd";
import Image from "next/image";
import Header from "@/components/home/Header";
import PropriedadesSelecionadas from "@/components/home/PropriedadesSelecionadas";
import PropriedadesPerto from "@/components/home/PropriedadesPerto";
import HomeFooter from "@/components/home/HomeFooter";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";

const isLoggedIn = false;

export default function Home() {
  useSEO(getSEOConfig("/"));
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

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-16">
        <div className="flex-1 w-full">
          {isLoggedIn ? <PropriedadesSelecionadas /> : <PropriedadesPerto />}
        </div>

        <div className="flex-shrink-0 w-full md:w-[20%]">
          <div className="hidden md:block pt-10">
            <Image
              src="/images/dudaShopVerticalMaior.svg"
              alt="dudaShopVertical"
              width={301}
              height={600}
              className="block object-contain pt-5"
            />
          </div>

          <div className="block md:hidden">
            <Image
              src="/images/dudaShop.svg"
              alt="dudaShop"
              width={344}
              height={100}
              className="block object-contain w-full"
            />
          </div>
        </div>
      </div>

      <Divider size="large" />
      <HomeFooter />
    </>
  );
}
