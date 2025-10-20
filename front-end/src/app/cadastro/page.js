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
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    const dados = {
      nome: values.name,
      email: values.email,
      senha: values.password,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        dados
      );
      
      message.success(response.data.message || "Conta criada com sucesso!");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("❌ Erro ao cadastrar:", error);

  // Pega a mensagem de erro padrão
  const errorMessage = error?.response?.data?.message || "Não foi possível conectar ao servidor. Tente novamente.";
      
  // Verificar se email já é cadastrado
  const msg = error?.response?.data?.message?.toLowerCase?.() || '';
  const status = error?.response?.status;
  const isEmailAlreadyExists = status === 409 || status === 400 ||
    msg.includes('email') || msg.includes('já existe') || msg.includes('already exists') || msg.includes('cadastrado') || msg.includes('duplicado');
  
  if (isEmailAlreadyExists) {
    // Erro específico do email
    form.setFields([
      { name: 'email', errors: ['Email já cadastrado'] },
      { name: 'name', errors: [] },
      { name: 'password', errors: [] }
    ]);
  } else {
    form.setFields([
      { name: 'name', errors: [errorMessage] },
      { name: 'email', errors: [] },
      { name: 'password', errors: [] }
    ]);
  }
} finally {
  setLoading(false);
}
  };

  const onFinishFailed = (errorInfo) => {
  };

  const handleSubmit = () => {
    form.setFields([
      { name: 'name', errors: [] },    
      { name: 'email', errors: [] },
      { name: 'password', errors: [] }  
    ]);
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
            form={form}
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
                    onClick={handleSubmit}
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
