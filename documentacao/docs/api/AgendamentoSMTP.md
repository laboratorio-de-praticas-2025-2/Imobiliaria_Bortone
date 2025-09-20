# Serviço de Envio de E-mails (SMTP)

Este documento descreve como funciona o envio de e-mails no módulo de **Agendamento de Visitação**.

---

## Objetivo

- Enviar **confirmação de agendamento** para o cliente.  
- Enviar **notificação de novo agendamento** para a imobiliária.  

---

## Construção Técnica

O serviço foi implementado usando **módulos nativos do Node.js**, sem dependências externas:

- `net` → abertura de conexão TCP com o servidor SMTP.  
- `tls` → suporte a conexão segura via SSL/TLS.  
- `buffer` → manipulação dos dados da mensagem.  

### Estrutura da Mensagem

O e-mail é montado manualmente com os cabeçalhos padrão:

- `From`: remetente  
- `To`: destinatário  
- `Subject`: assunto  
- `Content-Type`: `text/plain; charset=utf-8`  

O corpo do e-mail é enviado em **texto puro (plain text)**.  

---

## Parâmetros do Serviço

Configurados via variáveis de ambiente no arquivo `.env`:

- `SMTP_HOST` → endereço do servidor SMTP  
- `SMTP_PORT` → porta de conexão (587, 465, etc.)  
- `SMTP_SECURE` → `true` para TLS/SSL, `false` para conexão simples  
- `SMTP_USER` → usuário de autenticação  
- `SMTP_PASS` → senha de autenticação  

---

## Fluxo de Funcionamento

1. O **controller de agendamento** chama o serviço:
   ```js
   await emailService.sendMail({
     to: cliente.email,
     subject: "Confirmação de Agendamento",
     text: `Olá ${cliente.name}, sua visita ao imóvel ${propertyAddress} foi registrada com sucesso.`
   });

---

2. O serviço:

   * monta os cabeçalhos e o corpo da mensagem
   * abre conexão com o servidor SMTP
   * autentica usando `SMTP_USER` e `SMTP_PASS`
   * envia o e-mail para o(s) destinatário(s)
   * finaliza a sessão com `QUIT`

---

## Tipos de E-mail Enviados

### 📧 1. Confirmação para o Cliente

* Nome do cliente
* Endereço do imóvel
* Observações (caso tenha sido preenchido)

Exemplo de corpo:

```
Olá Tiago Rodrigues,  
Sua visita ao imóvel Rua Central, 123 foi registrada com sucesso.  
Observações: Gostaria de confirmar estacionamento disponível.  
```

---

### 🏢 2. Notificação para a Imobiliária

* Nome, e-mail, telefone e cidade/estado do cliente
* Endereço e ID do imóvel
* Observações adicionais

Exemplo de corpo:

```
Novo agendamento registrado:

Cliente: Tiago Rodrigues  
E-mail: cliente@email.com  
Telefone: 11999999999  
Cidade/Estado: Registro/SP  

Imóvel: Rua Central, 123 (ID: 45)  
Observações: Gostaria de confirmar estacionamento disponível.  
```

---

## Tratamento de Erros

* **Falha de conexão** → log `SMTP connection error`
* **Credenciais inválidas** → log `Authentication failed`
* **Endereço de destinatário inválido** → log `Invalid recipient`
* **Falha de transmissão** → log detalhado para debug

---

## Exemplos de Logs

* `E-mail de confirmação enviado ao cliente: cliente@email.com`
* `Nova visita agendada. Notificação enviada à imobiliária.`

---

```

---

Quer que eu também ajuste os **exemplos de corpo de e-mail** para ficarem **100% genéricos** (sem nomes e endereços fictícios), ou prefere manter esses exemplos preenchidos para dar mais clareza?
```

