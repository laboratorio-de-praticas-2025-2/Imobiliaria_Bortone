# Sistema de Notificações - Frontend

## 📋 Overview da Task

Como DEV frontend, você precisa implementar um sistema de notificações em tempo real que:

1. **Conecta** com o Socket.IO do back-end
2. **Escuta** eventos de notificação 
3. **Exibe** notificações estilizadas para o usuário
4. **Gerencia** o estado das notificações

## 🎯 Eventos do Back-end

O back-end emite os seguintes eventos que você deve escutar:

### 📤 Eventos Disponíveis:

```javascript
// 1. Nova recomendação personalizada (para usuários logados)
'nova_recomendacao' => {
  imovel: { id, tipo, endereco, preco, area, ... },
  motivo: 'baseado_no_seu_historico',
  timestamp: '2024-10-09T15:30:00Z'
}

// 2. Imóvel popular (broadcast geral)
'imovel_popular' => {
  id: 61,
  tipo: 'Terreno', 
  endereco: 'Rua Q, 234',
  preco: '185000.00',
  area: 700,
  // ... outros dados do imóvel
}

// 3. Conexão estabelecida
'connect' => // Socket conectado com sucesso

// 4. Erro de conexão  
'connect_error' => // Erro na conexão
```

## 🔧 Implementação Técnica

### 1. **Instalação das Dependências**

```bash
# Socket.IO Client
npm install socket.io-client

# Biblioteca de notificações (RECOMENDADA)
npm install react-hot-toast
# OU alternativa
npm install react-toastify
```

### 2. **Configuração do Socket.IO**

Crie: `src/services/socketService.js`

```javascript
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('💥 Erro de conexão:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Escutar eventos específicos
  onNovaRecomendacao(callback) {
    this.socket?.on('nova_recomendacao', callback);
  }

  onImovelPopular(callback) {
    this.socket?.on('imovel_popular', callback);
  }

  // Remover listeners
  off(event) {
    this.socket?.off(event);
  }
}

export default new SocketService();
```

### 3. **Hook para Gerenciar Notificações**

Crie: `src/hooks/useNotifications.js`

```javascript
import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import socketService from '../services/socketService';

export const useNotifications = () => {
  
  // Função para navegar para o imóvel
  const navigateToImovel = useCallback((imovelId) => {
    // Se usando React Router
    // navigate(`/imoveis/${imovelId}`);
    
    // Ou redirect direto
    window.location.href = `/imoveis/${imovelId}`;
  }, []);

  // Função para exibir notificação de recomendação CLICÁVEL
  const showRecomendacaoNotification = useCallback((data) => {
    const { imovel } = data;
    
    toast.success(
      `🏠 Nova recomendação: ${imovel.tipo} em ${imovel.cidade}`,
      {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          cursor: 'pointer', // ← Indica que é clicável
        },
        icon: '🎯',
        onClick: () => navigateToImovel(imovel.id), // ← CLICK para navegar
      }
    );
  }, [navigateToImovel]);

  // Função para exibir notificação de imóvel popular CLICÁVEL
  const showImovelPopularNotification = useCallback((imovel) => {
    const precoFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(imovel.preco));

    toast(
      `🔥 Imóvel em destaque: ${imovel.tipo} - ${precoFormatado}`,
      {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#F59E0B',
          color: 'white',
          cursor: 'pointer', // ← Indica que é clicável
        },
        icon: '⭐',
        onClick: () => navigateToImovel(imovel.id), // ← CLICK para navegar
      }
    );
  }, [navigateToImovel]);

  useEffect(() => {
    // Conectar socket
    socketService.connect();

    // Configurar listeners
    socketService.onNovaRecomendacao(showRecomendacaoNotification);
    socketService.onImovelPopular(showImovelPopularNotification);

    // Cleanup
    return () => {
      socketService.off('nova_recomendacao');
      socketService.off('imovel_popular');
    };
  }, [showRecomendacaoNotification, showImovelPopularNotification]);

  return {
    isConnected: socketService.isConnected,
    disconnect: socketService.disconnect,
  };
};
```

### 4. **Componente Principal**

Use no seu `App.js` ou componente principal:

```javascript
import { Toaster } from 'react-hot-toast';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { isConnected } = useNotifications();

  return (
    <div className="App">
      {/* Status da conexão (opcional) */}
      {!isConnected && (
        <div className="connection-status">
          🔴 Desconectado - Notificações indisponíveis
        </div>
      )}

      {/* Seu conteúdo existente */}
      <Routes>
        {/* suas rotas */}
      </Routes>

      {/* Container das notificações */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
```

## 🎨 Customização Avançada

### 🖱️ **Navegação por Clique (IMPLEMENTADO)**

As notificações já são **clicáveis** e redirecionam automaticamente para a página do imóvel:

```javascript
// ✅ CLICK na notificação = navegar para /imoveis/{id}
onClick: () => navigateToImovel(imovel.id)
```

### 🎨 **Estilização para Designers**

Para seguir o guia de estilo da sua marca:

```javascript
// Cores customizáveis por tipo
const notificationStyles = {
  recomendacao: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.25)',
  },
  popular: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white', 
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(245, 87, 108, 0.25)',
  },
  hover: {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease',
  }
};
```

### Notificação Custom Component (Máximo Controle Visual)

Se quiser mais controle visual:

```javascript
// src/components/NotificationCustom.js
import toast from 'react-hot-toast';

export const showCustomNotification = (imovel, tipo) => {
  toast.custom((t) => (
    <div className={`notification-custom ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
      <div className="notification-header">
        <span className="notification-icon">
          {tipo === 'recomendacao' ? '🎯' : '⭐'}
        </span>
        <span className="notification-title">
          {tipo === 'recomendacao' ? 'Nova Recomendação' : 'Imóvel em Destaque'}
        </span>
        <button onClick={() => toast.dismiss(t.id)} className="notification-close">
          ✕
        </button>
      </div>
      
      <div className="notification-content">
        <h4>{imovel.tipo} - {imovel.cidade}</h4>
        <p>{imovel.endereco}</p>
        <p className="price">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(parseFloat(imovel.preco))}
        </p>
      </div>
      
      <div className="notification-actions">
        <button 
          onClick={() => {
            // 🎯 NAVEGAÇÃO IMPLEMENTADA - Vai para página do imóvel
            window.location.href = `/imoveis/${imovel.id}`;
            toast.dismiss(t.id);
          }}
          className="btn-primary"
        >
          Ver Detalhes
        </button>
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="btn-secondary"
        >
          Fechar
        </button>
      </div>
    </div>
  ), {
    duration: 6000,
  });
};
```

## 🔍 Testes e Debug

### Como Testar:

1. **Inicie o back-end** (porta 4000)
2. **Inicie o front-end** (porta 3000)
3. **Cadastre um imóvel** via API/Postman
4. **Observe** as notificações aparecerem

### Debug no Console:

```javascript
// Verificar se o socket está conectado
console.log('Socket conectado:', socketService.isConnected);

// Escutar todos os eventos (debug)
socketService.socket?.onAny((eventName, ...args) => {
  console.log(`📡 Evento recebido: ${eventName}`, args);
});
```

## 📚 Bibliotecas Recomendadas

### 🥇 **Opção 1: React Hot Toast** (RECOMENDADA)
- ✅ Leve e rápida
- ✅ Boa customização
- ✅ Animações suaves
- ✅ TypeScript support

```bash
npm install react-hot-toast
```

### 🥈 **Opção 2: React Toastify**
- ✅ Mais features
- ✅ Posicionamento avançado
- ✅ Temas prontos
- ⚠️ Mais pesada

```bash
npm install react-toastify
```

### 🥉 **Opção 3: Implementação Custom**
- ✅ Controle total
- ✅ Sem dependências extras
- ⚠️ Mais trabalho

## 🚀 Entrega da Task

### Checklist de Implementação:

- [ ] Instalar dependências (`socket.io-client` + biblioteca de notificações)
- [ ] Criar serviço de Socket.IO (`socketService.js`)
- [ ] Criar hook de notificações (`useNotifications.js`)
- [ ] Integrar no componente principal (`App.js`)
- [ ] Configurar container de notificações (`<Toaster />`)
- [ ] Testar recebimento de eventos
- [ ] Estilizar notificações (responsivo)
- [ ] Adicionar navegação para imóvel (opcional)
- [ ] Documentar no README do front-end

### 🎯 Resultado Esperado:

Quando um imóvel for cadastrado no back-end, o front-end deve:
1. **Receber** o evento automaticamente
2. **Exibir** notificação estilizada
3. **Permitir** interação (fechar, navegar)
4. **Funcionar** em qualquer página da aplicação

## 🆘 Dúvidas?

- **Backend URL**: `http://localhost:4000`
- **Eventos disponíveis**: `nova_recomendacao`, `imovel_popular`
- **Posicionamento**: `top-right` (padrão)
- **Duração**: 4-6 segundos

**Boa implementação!** 🚀