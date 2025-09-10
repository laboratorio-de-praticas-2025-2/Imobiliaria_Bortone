# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de manifesto para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa final: imagem leve
FROM node:20-alpine
WORKDIR /app

# Copia build + node_modules do builder
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
