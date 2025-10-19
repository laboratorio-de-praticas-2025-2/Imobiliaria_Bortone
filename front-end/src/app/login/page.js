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
  const [form] = Form.useForm();
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

      // Garante que o socket sempre conecta autenticado
      if (typeof window !== 'undefined' && window.socketService) {
        await window.socketService.disconnect();
        await window.socketService.connect(response.data.token);
      }

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
      
      const msg = error?.response?.data?.message?.toLowerCase?.() || '';
      const status = error?.response?.status;
      
      const errorMessage = error?.response?.data?.message || 'Erro ao conectar com o servidor.';
      
      if (msg.includes('email') || status === 404 || msg.includes('não encontrado') || msg.includes('not found') || msg.includes('não existe') || msg.includes('não cadastrado')) {
        form.setFields([
          { name: 'email', errors: ['Email inválido'] },
          { name: 'password', errors: [] } 
        ]);
      } else if (status === 401 || status === 403 || msg.includes('credencial') || msg.includes('senha') || msg.includes('password') || msg.includes('incorreto')) {
        form.setFields([
          { name: 'email', errors: [] },
          { name: 'password', errors: ['Senha inválida'] }
        ]);
      } else {
        form.setFields([
          { name: 'email', errors: [] },
          { name: 'password', errors: [errorMessage] }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
  };

  // Limpar erros ao tentar novamente
  const handleSubmit = () => {
    form.setFields([
      { name: 'email', errors: [] },
      { name: 'password', errors: [] }
    ]);
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
            form={form}
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
                    onClick={handleSubmit}
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
