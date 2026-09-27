# ==========================================
# ETAPA 1: CONSTRUIR REACT + VITE
# ==========================================

FROM node:20-alpine AS build

WORKDIR /app

# Copiamos primero las dependencias
COPY package*.json ./

RUN npm ci

# Copiamos el frontend
COPY . .

# URL del backend, inyectada por Railway como build arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Generamos la versión de producción
RUN npm run build


# ==========================================
# ETAPA 2: SERVIR CON NGINX
# ==========================================

FROM nginx:alpine

# Copiamos únicamente el resultado compilado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]