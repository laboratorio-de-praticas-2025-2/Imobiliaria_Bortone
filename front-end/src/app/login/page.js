"use client";
import Link from "next/link";
import { Form, Input, Button, Flex, message } from "antd";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { useState } from "react";
import axios from "axios";         
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  // SEO para página de login
  useSEO(getSEOConfig('/login'));

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Capturar parâmetro de redirecionamento
  const getRedirectPath = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('redirect') || '/';
    }
    return '/';
  };

  const onFinish = async (values) => {
    setLoading(true);

        const dados = {
        email: values.email,
        senha: values.password
    };


      try {

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        dados
      );
      message.success(response.data.message || `Login bem-sucedido!`);

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));

      // Verificar o que foi salvo no localStorage
      const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

      // Redirecionamento baseado no parâmetro redirect ou nível do usuário
      const redirectPath = getRedirectPath();
      const userLevel = parseInt(savedUserInfo.nivel ?? 1);

      let finalRedirect = redirectPath;
      
      // Se tentou acessar admin mas não é admin, redirecionar para home
      if (redirectPath.includes('/admin') && userLevel !== 0) {
        message.warning('Você não tem permissão para acessar a área administrativa.');
        finalRedirect = '/';
      }


      setTimeout(() => {
        router.push(finalRedirect);
      }, 1000);

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
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
