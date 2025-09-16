# 📦 Funcionalidade de Agendamento de Visitação

Este módulo é responsável por registrar solicitações de visitas a imóveis, enviar e-mails de confirmação aos clientes e notificar a imobiliária sobre novos agendamentos. Implementado em **Express.js**, utiliza serviços de **SMTP** para envio de e-mails.

---

## 🎯 Objetivo

- Permitir que clientes agendem visitas a imóveis.  
- Enviar confirmação de agendamento ao cliente via e-mail.  
- Notificar a imobiliária sobre novos agendamentos ou imóveis disponíveis.  

---

## 📥 Dados de Entrada

### 1. Agendamento de Visita (`/agendamento_visita`)

O endpoint recebe um objeto JSON com os seguintes campos obrigatórios:

- `name`: Nome do cliente  
- `email`: E-mail do cliente  
- `date`: Data da visita (YYYY-MM-DD)  
- `time`: Horário da visita (HH:mm)  

Campos opcionais:

- `phone`: Telefone do cliente  
- `propertyAddress`: Endereço do imóvel  
- `propertyId`: Identificador do imóvel  
- `notes`: Observações adicionais  

Exemplo de entrada:

```json
{
  "name": "Tiago Rodrigues",
  "email": "cliente@email.com",
  "phone": "11999999999",
  "date": "2025-09-20",
  "time": "15:00",
  "propertyAddress": "Rua Central, 123",
  "propertyId": 45,
  "notes": "Gostaria de confirmar estacionamento disponível"
}
````

---

## 📤 Saída Esperada

### Agendamento de Visita

Sucesso (200):

```json
{
  "message": "Agendamento registrado com sucesso.",
  "data": {
    "id": 101,
    "name": "Tiago Rodrigues",
    "email": "cliente@email.com",
    "phone": "11999999999",
    "date": "2025-09-20",
    "time": "15:00",
    "propertyAddress": "Rua Central, 123",
    "propertyId": 45,
    "notes": "Gostaria de confirmar estacionamento disponível"
  }
}
```

Erros possíveis:

* 400: Campos obrigatórios ausentes
* 429: Limite de agendamentos excedido (5 por minuto por IP/rota)
* 500: Erro interno do servidor

---

## ⚙️ Lógica Geral do Algoritmo

### 1. Registro do Agendamento

* Valida campos obrigatórios (`name`, `email`, `date`, `time`).
* Aplica **rate limiting** (máx. 5 agendamentos por minuto por IP/rota).
* Sanitiza e normaliza campos (`name`, `propertyAddress`, `notes`).
* Persiste os dados no banco de dados.

### 2. Confirmação ao Cliente

* Gera e envia e-mail automático contendo:

  * Nome do cliente
  * Data e horário da visita
  * Endereço do imóvel
  * Observações

📌 Exemplo de log:
`E-mail de confirmação enviado ao cliente: cliente@email.com`

### 3. Notificação à Imobiliária

* Envia e-mail contendo:

  * Dados do cliente (nome, e-mail, telefone)
  * Data e horário da visita
  * Imóvel relacionado
  * Observações adicionais

📌 Exemplo de log:
`Nova visita agendada. Notificação enviada à imobiliária.`

### 4. Tratamento de Erros

* Logs são gerados caso o envio de e-mails falhe.
* Campos truncados (`name`, `address`, `notes`) respeitam limites de caracteres.
* Apenas e-mails válidos são aceitos.

---

## 🛠️ Bibliotecas e Ferramentas

* `net` / `tls` → Conexão TCP/SSL com SMTP
* `buffer` → Manipulação de dados de e-mail
* `express.js` → roteamento e endpoints

---

## ⚠️ Desafios e Limitações

* **Dependência de e-mail**: se o servidor SMTP estiver indisponível, a comunicação falha.
* **Escalabilidade**: aumento no número de agendamentos pode impactar performance.
* **Fusos horários**: é preciso tratar corretamente horários em diferentes regiões.
* **Rate limiting**: máximo de 5 agendamentos por minuto por IP/rota.

---

## 🚀 Testando os Endpoints

```http
POST    /agendamento_visita       → Cria um novo agendamento
GET     /agendamentos             → Lista agendamentos registrados
```

### GET - exemplo de saída

```json
{
  "message": "Agendamentos listados com sucesso.",
  "data": [
    {
      "id": 101,
      "name": "Tiago Rodrigues",
      "email": "cliente@email.com",
      "phone": "11999999999",
      "date": "2025-09-20",
      "time": "15:00",
      "propertyAddress": "Rua Central, 123",
      "propertyId": 45,
      "notes": "Gostaria de confirmar estacionamento disponível"
    }
  ]
}
```
