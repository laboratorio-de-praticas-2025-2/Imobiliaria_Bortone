# Módulo SMTP – Agendamento de Visitas

## Glossário

- **SMTP (Simple Mail Transfer Protocol):** protocolo para envio de e-mail entre servidores.
- **TCP:** protocolo que garante que os dados cheguem completos, na ordem certa e sem erros entre dois dispositivos.
- **TLS:** protocolo que criptografa e protege a comunicação sobre o TCP, garantindo segurança e integridade dos dados.
- **Socket:** um ponto de conexão entre dois computadores na rede que permite enviar e receber dados.
- **HELO/EHLO:** comandos de identificação; `EHLO` pede extensões (STARTTLS, AUTH, etc.).
- **STARTTLS:** comando que solicita upgrade da conexão para TLS sobre a mesma socket.
- **SMTPS:** TLS direto (porta 465).
- **AUTH PLAIN / AUTH LOGIN:** métodos de autenticação (base64).
- **MIME:** Multipurpose Internet Mail Extensions — formato para mensagens com várias partes (text, html, attachments).
- **multipart/alternative:** partes alternativas (por ex., plain text e HTML).
- **multipart/mixed:** estrutura que pode conter alternativas + anexos.
- **CRLF:** `\r\n` — fim de linha no SMTP (obrigatório).
- **dot-stuffing:** duplicar leading `.` em linhas do corpo antes de enviar (por RFC).
- **Message-ID:** identificador único do e-mail.
- **SPF/DKIM/DMARC:** mecanismos para autenticação de e-mail (evitam spoofing e melhoram entrega).
- **Base64:** codificação usada para anexos binários em SMTP.
- **Rate limiting:** limitar número de requisições por IP/endpoint para mitigar abuso.
- **Whitelist / Blacklist:** IPs explicitamente permitidos/negados.

---

## Descrição

O módulo de Agendamento implementa um sistema de envio de e-mails baseado no protocolo SMTP sem depender de bibliotecas externas. Ele garante que tanto o cliente quanto a equipe interna recebam confirmações e notificações sobre o agendamento.
A implementação usa net/tls para abrir sockets TCP/TLS e implementa manualmente os comandos SMTP, autenticação (PLAIN/LOGIN) e construção de mensagens MIME (texto, HTML, anexos).

---

## Objetivo

- Enviar confirmação de agendamento ao usuário (cliente) e notificar a imobiliária.
- Implementar validações e proteção contra abuso (rate limit, blacklist/whitelist, bloqueio de domínios temporários).
- Registrar logs de auditoria para rastreabilidade.

---

## Estrutura de arquivos


- agendamentoController.js → Valida entrada HTTP, normaliza dados, permite integração com mapaService para buscar detalhes do imóvel e chama serviços.

- agendamentoRoute.js → Define middlewares (headers de segurança, validação de content-type e payload size), rotas: /send, /schedule, /:id, /agendar, /property-notification.

- agendamentoService.js → Implementa SMTP client, validações de anexos, construção MIME, rate limiting, blacklist/whitelist.

---

## Configuração do Servidor SMTP

Antes de rodar o módulo, é necessário configurar as variáveis de ambiente:

```
- SMTP_HOST=mail.example.com     
- SMTP_PORT=587                     
- SMTP_SECURE=false                 
- SMTP_USER=usuario                 
- SMTP_PASS=senha             
- SMTP_HELO=localhost             
- MAIL_FROM_EMPRESA=noreply@ex.com 
- MAIL_TO_EMPRESA=agendamentos@...
- NODE_ENV=development|production

```
### Explicação sobre variáveis de ambiente

- SMTP_HOST — Endereço do servidor SMTP (ex: smtp.gmail.com).
- SMTP_PORT — Porta do servidor (587 para TLS, 465 para SSL).
- SMTP_SECURE — Define se a conexão deve usar SSL/TLS.
- SMTP_USER — E-mail usado para autenticação.
- SMTP_PASS — Senha ou token de acesso do e-mail. A senha é gerada por meio da autenticação de dois fatores.
- SMTP_HELO — Valor usado em EHLO/HELO. Default é "localhost".
- MAIL_FROM_EMPRESA — E-mail obrigatório para envios automáticos (sendScheduleConfirmation).
- MAIL_TO_EMPRESA — E-mail interno opcional; default é "agendamentos@imobiliaria-bortone.com.br".
- NODE_ENV — Define o ambiente da aplicação e controla a exposição de detalhes de erro (development ou production).

Observação: Nunca commitar credenciais no repositório.

---

## Fluxo de Envio de E-mails

1. **Requisição HTTP** chega no controller (ex.: /schedule).
2. **Controller** valida e normaliza input (regex de e-mail, tamanhos, trims).
3. **Controller** aplica lógica específica (ex.: busca imovel por ID via mapaService e mescla endereço).
4. **Verificação de segurança**, Controller checa rate limit: agendamentoService.checkRateLimit(clientIP, route):
    - Limite de 5 agendamentos por minuto por IP.
    - Bloqueio de IPs em blacklist.
    - Bloqueio de domínios suspeitos (ex: Mailinator, TempMail).
5. **Controller** chama agendamentoService.sendScheduleConfirmation({ appointment }).
6. **sendScheduleConfirmation** monta textos e HTML (usuário e empresa), cria SMTPClient com host/port/secure/user/pass/helo.
7. **SMTPClient.send()** abre socket (plain TCP ou TLS), aguarda banner (220), envia EHLO, verifica STARTTLS e, se disponível + desejado, faz upgrade TLS.
8. **Autentica** (AUTH PLAIN ou AUTH LOGIN) se user/pass informados.
9. **Realiza a troca de comandos SMTP** (`EHLO/HELO`, `AUTH`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`).
10. **Constrói mensagem MIME** via buildMime(...), aplica dot-stuffing, escreve o corpo e finaliza com .\r\n.
11. **Construção da mensagem MIME**:
    - Apenas texto **OU**
    - Texto + HTML (multipart/alternative) **OU**
    - Texto + HTML + Anexos (multipart/mixed).
12. **Lê** a resposta (250) e encerra com QUIT.
13. **Envio da mensagem** e retorno da resposta JSON para o cliente.

---

### Requisições

#### Rota POST /schedule

Recebe dados de agendamento, aplica rate limit, busca dados do imóvel (se id) e envia 2 e-mails (usuário + empresa).

```
{
  "name": "Tiago Rodrigues",
  "email": "tiago@example.com",
  "phone": "11999999999",
  "propertyId": "123",
  "propertyAddress": "Rua das Flores, 100",
  "notes": "Prefiro horário da manhã",
  "visitPeriod": "Manhã"
}
```

###### Resposta sucesso (200)

```
{ "success": true, "message": "Agendamento confirmado e e-mails enviados com sucesso" }
```

###### Resposta erro (400)

```
{ "error": "Erro ao processar agendamento"}
```

#### Rota POST /send

Envio direto de e-mail (teste).

```
{
  "host": "smtp.servidor.com",
  "port": 587,
  "secure": false,
  "user": "usuario",
  "pass": "senha",
  "from": "noreply@imobiliaria.com",
  "to": "cliente@example.com",
  "subject": "Teste",
  "text": "Mensagem em texto",
  "html": "<b>Mensagem HTML</b>",
  "attachments": [
    { "filename": "doc.pdf", "contentBase64": "JVBERi0x...", "contentType": "application/pdf" }
  ]
}
```
##### Resposta sucesso (200)

```
{ "success": true, "message": "Email enviado com sucesso", "data": { "ok": true, "message": "Enviado" } }
```

---

### Validações

- **E-mail** → Regex robusta + bloqueio de domínios temporários.
- **Porta SMTP** → Deve estar entre 1 e 65535.
- **Secure (TLS)** → Obrigatoriamente booleano.
- **Subject** → Máximo 200 caracteres.
- **Texto** → Máximo 10.000 caracteres.
- **HTML** → Máximo 20.000 caracteres.
- **Anexos** →
    - Tamanho máx. 10MB.
    - Tipos permitidos: `.jpeg, .png, .gif, .webp, .pdf, .txt, .doc, .docx, .xls, .xlsx`.
    - Nome máx. 255 caracteres (sem caracteres perigosos como `<, >, :, /, \\`).

---

## Montagem de mensagem por meio do MIME

A função `buildMime()` implementa a construção de e-mail para três cenários:

1. **Apenas texto (sem HTML, sem anexos)**
    - `Content-Type: text/plain; charset="utf-8"`
    - Corpo: texto truncado para `LIMITS.textBody`.
2. **Texto + HTML (sem anexos)**
    - `Content-Type: multipart/alternative; boundary="alt_..."`
    - Parte 1: `text/plain`
    - Parte 2: `text/html`
    - Fecha `-alt_...--`
3. **Com anexos**
    - `Content-Type: multipart/mixed; boundary="mix_..."`
    - Primeiro part: `multipart/alternative` (se houver HTML) ou `text/plain`
    - Em seguida: cada anexo com:
        
        ```
        --mix_...
        Content-Type: <contentType>; name="filename"
        Content-Transfer-Encoding: base64
        Content-Disposition: attachment; filename="filename"
        
        <base64 content>
        
        ```
        
    - Fecha `-mix_...--`

**Observações técnicas:**

- **Headers importantes:** sempre incluir From, To, Cc (opcional), Subject, Date, Message-ID e MIME-Version: 1.0.
- **Dot-stuffing:** se uma linha do corpo começar com ., duplicar o ponto (. → ..) antes de enviar.
- **Fim de linha:** todas as linhas devem terminar com \r\n (CRLF), como exige o padrão SMTP.
- **Encoding:**
   Anexos → base64
   Texto e HTML → 7bit (UTF-8). Se o conteúdo tiver caracteres especiais, pode usar quoted-printable.

---

## Segurança

- Uso de **TLS/SSL** para conexão segura com o servidor SMTP.
- Armazenamento seguro de credenciais via **variáveis de ambiente**.
- **Proteção contra spam:** limite de disparos por evento configurado no sistema.
- **Rate limiting**de 5 requisições/minuto por IP.
- **Whitelist de IPs:** `127.0.0.1`, `::1`.
- **Blacklist dinâmica**, IPs suspeitos podem ser bloqueados temporariamente.
- Limite de tamanho de **payload e anexos**.
- **Logs de auditoria**, todas as requisições logadas com IP, User-Agent, rota e horário.
- **Headers de segurança:** `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Content-Security-Policy`.
- **Sanitização**, uma prevenção contra injeção de headers e XSS em e-mails HTML.

---

## Exemplo de uso no Frontend

Ao finalizar o agendamento no frontend:

1. O usuário preenche os dados do agendamento.
2. O frontend envia a requisição ao backend.
3. O backend dispara os e-mails configurados.
4. O cliente recebe a confirmação diretamente na caixa de entrada.
5. A imobiliária recebe o e-mail de solicitação de agendamento do cliente

---

## Limitações

- Implementar SMTP por conta própria exige atenção e manutenção.
- Não possui fila de envio automática. Se o serviço cair, os e-mails podem ser perdidos.
- Anexos grandes ficam na memória como base64
