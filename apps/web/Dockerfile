FROM node:20-alpine

# Instala ferramentas necessárias
RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm@9.15.0

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN pnpm install

COPY --chown=node:node . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]