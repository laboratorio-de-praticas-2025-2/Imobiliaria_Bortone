"use client";
import Link from "next/link";
import { Form, Input, Button, Flex } from "antd";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { useState } from "react";

export default function LoginPage() {
  // SEO para página de login
  useSEO(getSEOConfig('/login'));

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // 🔹 Mock da chamada à API
      console.log("📡 Enviando login...", values);

      // Simula delay de request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock de resposta de sucesso
      const mockResponse = {
        success: true,
        token: "fake-jwt-token-123",
        user: {
          id: 1,
          name: "Amanda Dev",
          email: values.email,
        },
      };

      if (mockResponse.success) {
        message.success(`Bem-vinda, ${mockResponse.user.name}!`);
        // Aqui no futuro: salvar token no localStorage/cookie
        // e redirecionar com next/navigation -> router.push("/dashboard")
      } else {
        message.error("Credenciais inválidas, tente novamente.");
      }
    } catch (error) {
      console.error(error);
      message.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("❌ Falha no formulário:", errorInfo);
  };

  return (
    <div>
      <div className="image-header" />
      <Flex vertical align="center" gap="large" className="login-content">
        <h1 className="login-title text-2xl text-[var(--primary)]">
          Faça seu login
        </h1>
        <Flex vertical className="login-form-container">
          <Form
            name="login"
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Flex vertical align="center">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Por favor, insira seu email!" },
                ]}
                className="login-form-item"
              >
                <Input placeholder="Digite seu email:" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Por favor, insira sua senha!" },
                ]}
                className="login-form-item"
              >
                <Input.Password placeholder="Digite sua senha:" />
              </Form.Item>
              <Form.Item>
                <Flex vertical align="center" gap="small">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-button"
                    loading={loading}
                  >
                    Entrar
                  </Button>
                  <Flex>
                    <Link href="/cadastro" className="redirect-link">
                      Cadastre-se
                    </Link>
                  </Flex>
                </Flex>
              </Form.Item>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </div>
  );
}
