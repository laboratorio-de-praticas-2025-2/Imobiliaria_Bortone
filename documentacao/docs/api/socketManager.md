# Especificação Técnica: SocketManager (Issue #2)

## 1. Resumo da Funcionalidade

O **`SocketManager`** é o módulo de infraestrutura da nossa API, responsável por toda a comunicação em tempo real. Sua função é gerenciar as conexões WebSocket dos usuários e fornecer um canal de entrega para que as notificações, decididas pelo `NotificationService`, cheguem instantaneamente ao front-end.

---

## 2. Contrato do Módulo (Interfaces Públicas)

Este módulo irá expor duas funções principais para o resto da aplicação:

-   **`init(httpServer)`**
    -   **Parâmetros:** A instância do servidor HTTP principal da aplicação.
    -   **Ação:** Inicializa o servidor `Socket.IO`, configura o middleware de autenticação e anexa os listeners de conexão. Deve ser chamada uma única vez na inicialização do servidor.

-   **`enviarNotificacaoParaUsuarios(listaDeIds, payload)`**
    -   **Parâmetros:**
        -   `listaDeIds`: Um array com os IDs dos usuários que devem receber a mensagem.
        -   `payload`: O objeto JSON da notificação (definido no `NotificationService`).
    -   **Ação:** Dispara um evento (`emit`) através do WebSocket apenas para os usuários contidos na `listaDeIds`.

---

## 3. Dependências e Padrões Técnicos

-   **Bibliotecas:** `socket.io`, `jsonwebtoken` (para validar o token de autenticação).
-   **Módulos Internos:** Nenhum. Este módulo é a base, ele não depende de outros serviços; os outros dependem dele.

---

## 4. Lógica de Execução Detalhada

O funcionamento do módulo se divide em dois fluxos principais:

### Fluxo 1: Gerenciamento de Conexão do Usuário

Este fluxo ocorre sempre que um usuário abre ou fecha o site.

#### Middleware de Autenticação (JWT)
-   Para cada nova conexão iniciada pelo front-end, este middleware será executado primeiro.
-   Ele irá pegar o token JWT enviado pelo cliente (via `socket.handshake.auth.token`).
-   Ele usará a biblioteca `jsonwebtoken` para validar o token.
-   Se o token for válido, os dados do usuário (principalmente o `id`) serão extraídos e anexados ao objeto `socket` para serem usados no próximo passo.
-   Se o token for inválido, a conexão será recusada.

#### Entrada na Sala Privada
-   Após a autenticação bem-sucedida, o evento `connection` é disparado.
-   Nossa lógica irá pegar o `id` do usuário (anexado pelo middleware) e colocar a conexão (`socket`) em uma "sala" (`room`) privada e única.
-   **Exemplo:** O usuário com `id: 123` será colocado na sala com o nome `user_123`. Isso é feito com o comando `socket.join('user_123')`.

#### Desconexão
-   O listener do evento `disconnect` cuidará da limpeza quando o usuário fechar a aba.

### Fluxo 2: Envio de Notificações (Chamado pelo `NotificationService`)

Este fluxo ocorre quando o `NotificationService` decide que uma notificação precisa ser enviada.

#### Recebimento da Ordem de Envio
-   A função `enviarNotificacaoParaUsuarios` é chamada pelo `NotificationService`, recebendo a `listaDeIds` e o `payload`.
-   Este módulo **recebe** a lista de IDs. Ele não é responsável por calcular ou decidir quem deve receber a notificação. Seu papel é apenas o de "carteiro".

#### Disparo Direcionado para as Salas
-   A função faz um loop pela `listaDeIds`.
-   Para cada `userId` na lista, ela usa o comando `io.to()` para direcionar a mensagem apenas para a sala daquele usuário específico.
-   **Exemplo:** `io.to('user_123').emit('nova_notificacao', payload);`
