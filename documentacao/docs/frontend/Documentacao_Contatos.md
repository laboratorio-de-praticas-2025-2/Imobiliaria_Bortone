# 📍 Endereço da Imobiliária – JSON e Link para Google Maps

Este conteúdo documenta como a **imobiliária Grupo Bortone** disponibiliza seu endereço físico e sua localização no Google Maps por meio de um arquivo **JSON** estruturado e de links seguros e acessíveis.
---

## 📘 1. Endereço – `endereco.json`

O arquivo `endereco.json` armazena de forma organizada o endereço completo da imobiliária, junto com suas coordenadas geográficas e link para o Google Maps.

### 📄 Exemplo de conteúdo:

```json
{
  "endereco": "Rua Tamekishi Takano, 713 - Centro - Registro - SP",
  "latitude": -24.49661,
  "longitude": -47.84408,
  "googleMaps": {
    "url": "https://www.google.com/maps/place/Grupo+Bortone+-+Contabilidade+e+Imobiliaria/@-24.4967704,-47.8441063,20z/data=!4m14!1m7!3m6!1s0x94c53380caf3ed97:0x9710fe9448755e1c!2sGrupo+Bortone+-+Contabilidade+e+Imobiliaria!8m2!3d-24.4966434!4d-47.8440571!16s%2Fg%2F11hb5q5xgn!3m5!1s0x94c53380caf3ed97:0x9710fe9448755e1c!8m2!3d-24.4966434!4d-47.8440571!16s%2Fg%2F11hb5q5xgn?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
    "target": "_blank",
    "rel": "noreferrer"
  }
}

✅ Função:  
● Armazena o endereço completo da empresa de forma estruturada.  
● Guarda coordenadas geográficas (latitude e longitude) para integração com mapas ou aplicativos de localização.  
● Permite gerar dinamicamente links seguros para Google Maps em sistemas de back-end.  
● Facilita manutenção: se o endereço mudar, basta atualizar o JSON.  
________________________________________  
⚙️ 2. Configuração do Link para o Google Maps  
O link é configurado para abrir a localização em uma nova aba/janela do navegador, garantindo privacidade do usuário.  

✅ Explicação dos campos:  
Campo     	Valor	Descrição  
endereco	"Rua Tamekishi Takano, 713 - Centro - Registro - SP"	Endereço completo da imobiliária.  
latitude	-24.49661	Coordenada geográfica para localização em mapas.  
longitude	-47.84408	Coordenada geográfica para localização em mapas.  
url	Link do Google Maps	Abre diretamente a localização da empresa no Google Maps.  
target	_blank	Abre o link em nova aba ou janela do navegador.  
rel	noreferrer	Impede que informações de referência sejam enviadas ao Google Maps, aumentando a privacidade.  

💡 Como funciona no front-end?  
● O usuário clica no link “Abrir no Google Maps”.  
● O navegador abre uma nova aba com a localização exata da empresa.  
● As coordenadas já estão configuradas, garantindo precisão.  
● Nenhuma informação sobre a página de origem é enviada ao Google Maps, graças ao rel="noreferrer".  
________________________________________  
🔐 Segurança e privacidade  
● O uso de rel="noreferrer" garante que o Google Maps não receba dados sobre de qual site o usuário veio.  
● target="_blank" melhora a experiência do usuário, abrindo a localização sem interromper a página atual.  
● Ideal para conformidade com LGPD e boas práticas de UX.  

📞 2. Telefone – JSON e Link clicável  
O telefone da empresa é armazenado em JSON simples e apresentado como link clicável para discagem.  

📄 Exemplo de conteúdo (telefone.json):  
```json
{
    "telefone": "(13) 99672-0645"
}

📄 Exemplo de link no front-end:  
[📲 Ligar agora](tel:+551399672-0645)  
✅ Função:  
●	Facilita a discagem direta no celular ou apps de comunicação.  
●	Permite atualizar o número apenas no arquivo JSON, refletindo automaticamente no site.  
________________________________________  

✉️ 3. E-mail – JSON e Link com mailto  
O e-mail de contato é armazenado em JSON e apresentado como link mailto: com atributos de privacidade.  
📄 Exemplo de conteúdo (email.json):  
```json
{
  "email": "contato@grupobortone.com.br"
   "emailMenssagem": {
      "url": "mailito:contato@grupobortone.com.br?subject=Imobiliario",
      "target": "_blank",
      "rel": "noreferrer"}
}

✅ Função:  
●	Abre automaticamente o cliente de e-mail do usuário.  
●	Protege a privacidade com rel="noreferrer".  
●	Melhora experiência do usuário com target="_blank".  
________________________________________  

🌐 4. Redes Sociais – JSON e Links  
As redes sociais da empresa são armazenadas em JSON e apresentadas como links clicáveis.  
📄 Exemplo de conteúdo (redesSociais.json):  
```json
{
  "instagram": "https://www.instagram.com/explore/locations/1340102492689939/bortone-contabilidade-imobiliaria-e-despachante",
  "facebook": "https://www.facebook.com/grupobortone/?locale=pt_BR",
  "rel": "noreferrer"
}

📄 Exemplo de links no front-end:
- [📸 Instagram](https://www.instagram.com/explore/locations/1340102492689939/bortone-contabilidade-imobiliaria-e-despachante)
- [📘 Facebook](https://www.facebook.com/grupobortone/?locale=pt_BR)
✅ Função:
●	Mantém todos os links de redes sociais organizados.
●	Permite abrir em nova aba e protege a privacidade com rel="noreferrer".
________________________________________
Tudo isso usando JSON estruturado para facilitar manutenção e integração com sistemas web.
