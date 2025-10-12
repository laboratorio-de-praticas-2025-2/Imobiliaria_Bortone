"use client";

import Link from "next/link";
import { Button, Result } from "antd";
import { useAuth } from "@/hooks/useAuth";

export default function UnauthorizedPage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle={
          !isLoggedIn 
            ? "Você precisa fazer login para acessar esta página."
            : `Desculpe, você não tem permissão para acessar esta página. (Nível atual: ${user?.nivel})`
        }
        extra={
          <div className="space-x-4">
            {!isLoggedIn ? (
              <Link href="/login">
                <Button type="primary" size="large">
                  Fazer Login
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button type="primary" size="large">
                  Voltar ao Início
                </Button>
              </Link>
            )}
            <Link href="/contato">
              <Button size="large">
                Entrar em Contato
              </Button>
            </Link>
          </div>
        }
      />
    </div>
  );
}