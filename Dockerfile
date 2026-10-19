# Etapa 1: compila o Tailwind (@import "tailwindcss")
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:css

# Etapa 2: serve o site estático com Nginx
FROM nginx:alpine
COPY --from=build /app/index.html /app/cardapio.html /usr/share/nginx/html/
COPY --from=build /app/Galeria /usr/share/nginx/html/Galeria
COPY --from=build /app/src /usr/share/nginx/html/src
EXPOSE 80