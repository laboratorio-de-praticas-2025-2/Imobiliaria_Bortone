FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=dev
COPY . .
EXPOSE 4000
CMD ["node", "src/app.js"]


