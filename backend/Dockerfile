# Use Node.js 18 Alpine (leve e seguro)
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Copia o schema do Prisma
COPY prisma ./prisma

# Gera o Prisma Client (SEM rodar migrations)
RUN npx prisma generate

# Copia o resto do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
