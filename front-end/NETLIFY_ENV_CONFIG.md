# Configurar Variáveis de Ambiente no Netlify

## 🌐 **Configuração via Site do Netlify**

### **1. Acesse o painel do Netlify:**

1. Vá para [https://app.netlify.com](https://app.netlify.com)
2. Faça login na sua conta
3. Selecione seu site (nome do projeto)

### **2. Navegue até as configurações:**

1. Clique em **"Site settings"** no menu principal
2. No menu lateral, clique em **"Environment variables"**

### **3. Adicione as seguintes variáveis:**

Clique em **"Add a variable"** para cada uma:

#### **Variáveis Obrigatórias:**

| Nome da Variável | Valor | Descrição |
|------------------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://seu-backend.onrender.com` | URL do seu backend |
| `NODE_ENV` | `production` | Ambiente de produção |
| `NEXT_TELEMETRY_DISABLED` | `1` | Desabilita telemetria |
| `NODE_VERSION` | `18` | Versão do Node.js |

#### **Variáveis Opcionais:**

| Nome da Variável | Valor | Descrição |
|------------------|-------|-----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `sua_chave_aqui` | Chave do Google Maps |

### **4. Configuração Passo a Passo:**

#### **Variável 1: NEXT_PUBLIC_API_URL**
```
Scopes: All scopes
Values: https://seu-backend.onrender.com
```

#### **Variável 2: NODE_ENV**
```
Scopes: All scopes  
Values: production
```

#### **Variável 3: NEXT_TELEMETRY_DISABLED**
```
Scopes: All scopes
Values: 1
```

#### **Variável 4: NODE_VERSION**
```
Scopes: All scopes
Values: 18
```

### **5. Após adicionar todas as variáveis:**

1. Clique em **"Save"** 
2. Vá para **"Deploys"** no menu principal
3. Clique em **"Trigger deploy"** → **"Deploy site"**

## 🔧 **Troubleshooting**

### **Se o deploy ainda falhar:**

1. **Verificar logs de build** em **Deploys** → **Deploy log**
2. **Confirmar variáveis** em **Site settings** → **Environment variables**
3. **Fazer redeploy** após qualquer mudança

### **URLs importantes:**

- **Site settings**: `https://app.netlify.com/sites/SEU_SITE/settings/general`
- **Environment variables**: `https://app.netlify.com/sites/SEU_SITE/settings/env`
- **Deploy logs**: `https://app.netlify.com/sites/SEU_SITE/deploys`

## ✅ **Checklist Final**

- [ ] `NEXT_PUBLIC_API_URL` configurada com URL do backend
- [ ] `NODE_ENV` definida como `production`
- [ ] `NEXT_TELEMETRY_DISABLED` definida como `1`
- [ ] `NODE_VERSION` definida como `18`
- [ ] Deploy retriggered após adicionar variáveis
- [ ] Logs de build verificados

### **📱 Exemplo de configuração:**

```bash
# Suas variáveis devem aparecer assim no painel:
NEXT_PUBLIC_API_URL=https://imobiliaria-backend.onrender.com
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NODE_VERSION=18
```

Após configurar, faça um novo deploy e o site deve funcionar corretamente!
