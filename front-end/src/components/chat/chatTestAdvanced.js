// components/chat/ChatTestAdvanced.js
"use client";
import { useState } from "react";
import { Form, Input, Button, Card, message, Divider } from "antd";
import ChatModal from "./chatModal.js";
import axios from "axios";

export default function ChatTestAdvanced() {
  const [activeChat, setActiveChat] = useState(null);
  const [userSessions, setUserSessions] = useState({}); // { sessionId: {token, userInfo} }
  const [currentSession, setCurrentSession] = useState(null);

  const handleLogin = async (values, sessionId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        {
          email: values.email,
          senha: values.password
        }
      );

      const sessionData = {
        token: response.data.token,
        userInfo: response.data.user
      };

      setUserSessions(prev => ({
        ...prev,
        [sessionId]: sessionData
      }));

      message.success(`Login realizado como ${response.data.user.nome} (Sessão ${sessionId})`);
      
      // Simular salvamento no localStorage para a sessão atual
      if (sessionId === currentSession) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      }

    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Erro ao fazer login");
      }
    }
  };

  const handleOpenChat = (sessionId) => {
    const session = userSessions[sessionId];
    if (!session) {
      message.warning("Faça login primeiro na sessão " + sessionId);
      return;
    }

    // Salvar dados da sessão no localStorage antes de abrir o chat
    localStorage.setItem('authToken', session.token);
    localStorage.setItem('userInfo', JSON.stringify(session.userInfo));
    
    setCurrentSession(sessionId);
    setActiveChat(sessionId);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setCurrentSession(null);
  };

  const handleRegisterUser = async (values, sessionId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          nome: values.nome,
          email: values.email,
          senha: values.password,
        }
      );
      
      message.success(`Usuário ${values.nome} cadastrado com sucesso! (Sessão ${sessionId})`);
      
      // Fazer login automaticamente após cadastro
      setTimeout(() => {
        handleLogin({
          email: values.email,
          password: values.password
        }, sessionId);
      }, 1000);

    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Erro ao cadastrar usuário");
      }
    }
  };

  const SessionCard = ({ sessionId, title, color }) => {
    const session = userSessions[sessionId];

    return (
      <Card 
        title={title}
        style={{ borderColor: color }}
        className={`mb-4 ${session ? 'bg-green-50' : 'bg-gray-50'}`}
      >
        {session ? (
          <div>
            <p><strong>Usuário:</strong> {session.userInfo.nome}</p>
            <p><strong>Email:</strong> {session.userInfo.email}</p>
            <p><strong>Nível:</strong> {session.userInfo.nivel === 0 ? 'Admin' : 'Usuário'}</p>
            <Button 
              type="primary" 
              style={{ backgroundColor: color }}
              onClick={() => handleOpenChat(sessionId)}
              className="mt-2"
            >
              Abrir Chat
            </Button>
          </div>
        ) : (
          <div>
            <Divider>Login</Divider>
            <Form onFinish={(values) => handleLogin(values, sessionId)} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{required: true}]}>
                <Input placeholder="email@exemplo.com" />
              </Form.Item>
              <Form.Item name="password" label="Senha" rules={[{required: true}]}>
                <Input.Password placeholder="senha" />
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: color }}>
                Fazer Login
              </Button>
            </Form>

            <Divider>Ou Cadastrar Novo Usuário</Divider>
            <Form onFinish={(values) => handleRegisterUser(values, sessionId)} layout="vertical">
              <Form.Item name="nome" label="Nome" rules={[{required: true}]}>
                <Input placeholder="Nome completo" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                <Input placeholder="email@exemplo.com" />
              </Form.Item>
              <Form.Item name="password" label="Senha" rules={[{required: true, min: 6}]}>
                <Input.Password placeholder="mínimo 6 caracteres" />
              </Form.Item>
              <Button type="default" htmlType="submit">
                Cadastrar e Fazer Login
              </Button>
            </Form>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Teste Avançado de Chat WebSocket</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <SessionCard 
          sessionId="user1" 
          title="👨‍💼 Sessão 1 - Usuário/Admin" 
          color="#1890ff" 
        />
        
        <SessionCard 
          sessionId="user2" 
          title="👤 Sessão 2 - Cliente" 
          color="#52c41a" 
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">🧪 Modo de Teste com IDs Fixos</h3>
        <p className="text-gray-600 mb-4">
          Use os botões abaixo para testar sem autenticação usando IDs fixos.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => setActiveChat('test1')}
            type="default"
            className="bg-blue-100 border-blue-300"
          >
            Teste - Usuário 1 (Agente)
          </Button>
          <Button 
            onClick={() => setActiveChat('test2')}
            type="default"
            className="bg-green-100 border-green-300"
          >
            Teste - Usuário 2 (Cliente)
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">📋 Instruções:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li><strong>Teste com Autenticação Real:</strong> Faça login ou cadastre usuários nas duas sessões acima</li>
          <li><strong>Teste Rápido:</strong> Use os botões de teste com IDs fixos</li>
          <li><strong>Abra em Múltiplas Abas:</strong> Abra cada sessão em uma aba diferente do navegador</li>
          <li><strong>Troque Mensagens:</strong> Digite mensagens em uma sessão e veja aparecer na outra</li>
          <li><strong>Observe Status:</strong> Verifique o status de conexão no header do chat</li>
        </ol>
      </div>

      {/* Modal do Chat */}
      {activeChat && (
        <ChatModal 
          testUserId={activeChat.startsWith('test') ? activeChat.replace('test', '') : null}
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
}