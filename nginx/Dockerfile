FROM nginx:alpine

# Remplace la configuration par défaut par celle du reverse proxy du projet.
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Lance nginx au premier plan pour que Docker garde le conteneur en vie.
CMD ["nginx", "-g", "daemon off;"]