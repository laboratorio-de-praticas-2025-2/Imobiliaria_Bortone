# **Especificação Técnica: `NotificationService`**

#### 1\. Resumo da Funcionalidade

O `NotificationService` é o módulo interno responsável por aplicar a lógica de negócio que identifica quais usuários devem ser notificados sobre eventos relevantes, como o cadastro de um novo imóvel.

#### 2\. Contrato da Função Principal

  * **Função:** `async dispararAlertaNovoImovel(novoImovel)`
  * **Parâmetros:**
      * `novoImovel`: Objeto com os dados do imóvel recém-cadastrado.
  * **Retorno:** `Promise<void>`
      * A função não retorna um valor. Sua finalidade é acionar o `SocketManager` para o envio das notificações.

#### 3\. Dependências e Padrões Técnicos

  * **ORM:** Todas as consultas ao banco de dados neste serviço deverão ser feitas utilizando o **ORM Sequelize**, através dos modelos já existentes.
  * **Modelos Utilizados:** `Imovel`, `RecomendacaoImovel`.
  * **Módulos Internos:** `SocketManager`.

#### 4\. Lógica de Execução Detalhada

A função `dispararAlertaNovoImovel` seguirá os seguintes passos, tratando dois cenários de usuário distintos:

##### Cenário A: Notificação para Usuários com Histórico Relevante

1.  **Executar a Consulta Principal com Sequelize:**

      * Realizar uma consulta na tabela `RecomendacaoImovel` para encontrar `usuario_id` distintos.
      * A consulta deve fazer um `JOIN` com a tabela `Imoveis`.
      * A consulta deve aplicar as seguintes cláusulas `WHERE` para comparar o `novoImovel` com os imóveis visitados pelo usuário no **último mês**:
          * Localização próxima (`latitude`, `longitude`).
          * Preços semelhantes (`preco`).
          * Mesmo `status` (venda/aluguel).
          * `Area` semelhante.
          * Mesmo `tipo` de imóvel.

2.  **Acionar o Envio (Cenário A):**

      * Se a consulta retornar uma lista de IDs, o serviço montará o payload específico para o `novoImovel` e chamará o `SocketManager` para enviá-lo a esses usuários.
      * **Exemplo de Payload:**
        ```json
        {
          "mensagem": "Nova oportunidade em [cidade do imóvel] que pode te interessar!",
          "tipoNotificacao": "NOVO_IMOVEL",
          "dados": {
            "imovelId": novoImovel.id
          }
        }
        ```

##### Cenário B: Notificação para Usuários Sem Histórico Recente (Fallback)

Esta lógica roda em paralelo ou em sequência para engajar usuários novos ou inativos.

1.  **Identificar Usuários-Alvo:** O serviço usará o **Sequelize** para identificar o grupo de usuários que **não** têm nenhuma visita (`data_visita`) na `RecomendacaoImovel` nos últimos 30 dias.

2.  **Encontrar Imóvel Popular com Sequelize:**

      * O serviço fará uma consulta para encontrar os 10 `imovel_id` que mais aparecem na tabela `RecomendacaoImovel`.
      * Desta lista, ele **sorteia aleatoriamente um** `imovel_id`.
      * O serviço então busca os dados completos deste imóvel popular sorteado.

3.  **Acionar o Envio (Cenário B):**

      * O serviço montará um payload específico para o imóvel popular e chamará o `SocketManager` para enviá-lo ao grupo de usuários sem histórico recente.
      * **Exemplo de Payload:**
        ```json
        {
          "mensagem": "Confira um dos imóveis mais visitados da semana!",
          "tipoNotificacao": "IMOVEL_POPULAR",
          "dados": {
            "imovelId": id_do_imovel_sorteado
          }
        }
        ```
