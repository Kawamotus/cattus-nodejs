FROM node:22

# Cria o diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta (ajuste se for diferente no .env)
EXPOSE 3000

# Inicia a aplicação
CMD ["node", "index.js"]
