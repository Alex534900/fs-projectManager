# ==========================================
# ETAPA 1: COMPILAR TYPESCRIPT
# ==========================================

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Prisma necesita DATABASE_URL incluso para leer prisma.config.ts.
# Usamos una URL temporal SOLO durante la construcción.
RUN DATABASE_URL="postgresql://docker:docker@localhost:5432/docker" npx prisma generate

RUN npm run build


# ==========================================
# ETAPA 2: IMAGEN FINAL
# ==========================================

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

# Generar Prisma Client en la imagen final
# usando nuevamente una URL temporal de construcción.
RUN DATABASE_URL="postgresql://docker:docker@localhost:5432/docker" npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]