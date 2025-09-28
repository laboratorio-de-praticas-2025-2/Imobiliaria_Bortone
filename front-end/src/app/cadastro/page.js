"use client";
import Link from "next/link";
import { Form, Input, Button, Flex, message } from "antd";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "dotenv/config";

export default function CadastroPage() {
  // SEO para página de cadastro
  useSEO(getSEOConfig("/cadastro"));

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    const dados = {
      nome: values.name,
      email: values.email,
      senha: values.password,
    };
    try {
      console.log("📡 Enviando cadastro para o back-end...", dados);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        dados
      );
      
      console.log("✅ Resposta do servidor:", response.data);
      message.success(response.data.message || "Conta criada com sucesso!");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("❌ Erro ao cadastrar:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error(
          "Não foi possível conectar ao servidor. Tente novamente."
        );
      }
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
