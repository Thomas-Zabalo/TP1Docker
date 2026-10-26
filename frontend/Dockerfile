# Construit les fichiers statiques React dans une image temporaire.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

# L'image finale ne contient que les fichiers à servir par Nginx.
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Lance nginx au premier plan pour que Docker garde le conteneur en vie.
CMD ["nginx", "-g", "daemon off;"]