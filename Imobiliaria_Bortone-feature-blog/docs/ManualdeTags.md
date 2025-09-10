# Guia das Meta Tags Essenciais para SEO e Mídias Sociais

### As meta tags são trechos de código HTML que fornecem informações sobre o conteúdo de uma página web para os navegadores, mecanismos de busca e plataformas de mídia social. Elas não são visíveis para o usuário comum, mas são cruciais para a otimização de seu site.

## 1. Meta Tags Open Graph (OG):

### As meta tags Open Graph são um protocolo criado pelo Facebook para controlar como as informações de seu site são exibidas quando ele é compartilhado nas redes sociais. Elas garantem que seu link seja apresentado de forma profissional e atraente.

- `og:title`: Define o título que será exibido no compartilhamento. Geralmente, é o nome do seu negócio ou o título da página. Mantenha-o conciso e direto. <br/> Exemplo: `<meta property="og:title" content="One Help Informática - Assistência Técnica e Automação" />`

- `og:description`: Define a descrição que acompanhará o título. É sua chance de convencer o usuário a clicar no link, então crie uma descrição atrativa e informativa sobre o que a pessoa encontrará na página. <br/> Exemplo: `<meta property="og:description" content="Oferecemos serviços de manutenção, automação residencial, consultoria de compras de computadores e venda de equipamentos em Registro, Vale do Ribeira." />`

- `og:url`: Indica a URL exata da página que está sendo compartilhada. Isso ajuda a evitar problemas de duplicidade de conteúdo. <br/> Exemplo: `<meta property="og:url" content="https://onehelpinformatica.com.br/" />`

- `og:image`: Define a imagem que será exibida. Uma imagem de alta qualidade e que represente bem seu negócio pode aumentar significativamente o número de cliques. <br/> Exemplo: `<meta property="og:image" content="https://onehelpinformatica.com.br/imgs/OneHelpBlack.jpeg" />`

- `og:type`: Especifica o tipo de conteúdo da página (por exemplo, website, article, product). <br/> Exemplo: `<meta property="og:type" content="website" />`

- `og:locale`: Informa o idioma e a região do conteúdo (por exemplo, pt_BR para Português do Brasil). <br/> Exemplo: `<meta property="og:locale" content="pt_BR" />`

- `og:site_name`: Define o nome do seu site, que será exibido acima do título em algumas plataformas. <br/> Exemplo: <meta property="og:site_name" content="One Help Informatica"/>

## 2. Meta Tags do Twitter Card
### As meta tags do Twitter Card funcionam de forma semelhante às do Open Graph, mas são específicas para a plataforma X (antigo Twitter).

- `twitter:card`: Define o tipo de cartão que será exibido. O valor summary_large_image cria um cartão com um título, descrição e uma imagem grande acima. <br/> Exemplo: `<meta name="- twitter:card" content="summary_large_image" />`

- `twitter:title`: O título que aparecerá no card do Twitter. <br/> Exemplo: `<meta name="- twitter:title" content="Assistência Técnica e Automação Residencial - Registro" />`

- `twitter:description`: A descrição que acompanhará o título. <br/> Exemplo: `<meta name="- twitter:description" content="Serviços de manutenção, automação, consultoria de compras de computadores e equipamentos em Registro, SP." />`

- `twitter:image`: A imagem que será exibida no card. <br/> Exemplo: `<meta name="- twitter:image" content="https://onehelpinformatica.com.br/imgs/OneHelpBlack.jpeg" />`

## 3. Meta Tags Essenciais para SEO
### Essas tags ajudam os mecanismos de busca, como o Google, a entender o conteúdo da sua página.

- `description`: Esta é uma das meta tags mais importantes para o SEO. Ela fornece uma descrição concisa do conteúdo da página. Essa descrição geralmente aparece nos resultados da pesquisa (SERP) logo abaixo do título, por isso, é fundamental que seja bem escrita e inclua palavras-chave relevantes. <br/> Exemplo: `<meta name='description' content='Loja especializada em assistência técnica, automação residencial, consultoria de compras de computadores e venda de equipamentos em Registro, SP, Vale do Ribeira.' />`

- `charset="utf-8"`: Define o conjunto de caracteres utilizado na página, garantindo que os textos sejam exibidos corretamente em todos os navegadores e dispositivos. O utf-8 é o padrão global e suporta a maioria dos caracteres especiais. <br/> Exemplo: `<meta charSet="utf-8"/>`

`robots`: Instruções para os robôs dos mecanismos de busca. 

- `content="index, follow"`: Permite que os robôs indexem (incluam a página nos resultados) e sigam os links internos da página. Esta é a configuração padrão e a mais comum para a maioria das páginas. <br/> Exemplo: `<meta name='robots' content='index, follow' />`

- `google-site-verification`: Uma tag usada para verificar a propriedade do seu site junto ao Google Search Console. Isso é essencial para monitorar o desempenho do seu site nas buscas. <br/> Exemplo: `<meta name="google-site-verification" content="BxmEKnfsB-SA6Q" />`

## 4. Outras Tags e Links Importantes

- `canonical`: A tag `<link rel="canonical" href="..." />` é crucial para evitar conteúdo duplicado. Ela informa ao Google qual é a URL "principal" ou preferida de uma página, especialmente útil quando há mais de uma URL que leva ao mesmo conteúdo (por exemplo, com parâmetros de rastreamento). <br/> Exemplo: `<link rel="canonical" href="https://onehelpinformatica.com.br/" />`

- `viewport`: A tag `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` é fundamental para o design responsivo. Ela garante que a página se adapte corretamente a diferentes tamanhos de tela, como em celulares e tablets, oferecendo uma boa experiência ao usuário. <br/> Exemplo: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

- `theme-color`: A tag `<meta name="theme-color" content="#1C2132" />` permite que você personalize a cor da barra de ferramentas do navegador em dispositivos Android. É um pequeno toque que harmoniza a interface do navegador com a paleta de cores do seu site, criando uma experiência mais fluida. <br/> Exemplo: `<meta name="theme-color" content="#1C2132" />`