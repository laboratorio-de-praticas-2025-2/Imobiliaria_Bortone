"use client";
import Link from "next/link";
import { Form, Input, Button, Flex } from "antd";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { useState } from "react";

export default function CadastroPage() {
  // SEO para página de cadastro
  useSEO(getSEOConfig('/cadastro'));

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // 🔹 Mock da chamada à API
      console.log("📡 Enviando cadastro...", values);

      // Simula delay de request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock de resposta
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: values.name,
          email: values.email,
        },
      };

      if (mockResponse.success) {
        message.success(`Conta criada para ${mockResponse.user.name}!`);
        // Aqui no futuro: redirecionar para login
        // router.push("/login")
      } else {
        message.error("Erro ao criar conta. Tente novamente.");
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
          Faça seu cadastro
        </h1>
        <Flex vertical className="login-form-container">
          <Form
            name="cadastro"
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Flex vertical align="center">
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Por favor, insira seu nome!" },
                ]}
                className="login-form-item"
              >
                <Input placeholder="Digite seu nome:" />
              </Form.Item>
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
                    <Link href="/login" className="redirect-link">
                      Já possuo uma conta
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
