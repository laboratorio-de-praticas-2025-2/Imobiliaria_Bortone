"use client";
import { Button, Flex } from "antd";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";

export default function BoasVindasPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const timer1 = setTimeout(() => setAnimateOut(true), 2000);
      const timer2 = setTimeout(() => setShowSplash(false), 2500);
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
    <div>
      <div className="image-header" />
      <Flex vertical align="center" gap="large" className="boas-vindas-content">
        <h1 className="login-title text-2xl text-[var(--primary)]">
          Bem Vindo!
        </h1>
        <Flex
          vertical
          className="login-form-container"
          gap="large"
          align="center"
        >
          <Button
            type="primary"
            htmlType="submit"
            className="login-button w-[100%]"
            href="/cadastro"
          >
            Criar uma conta
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="login-sec-button w-[100%]"
            href="/login"
          >
            Login
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
