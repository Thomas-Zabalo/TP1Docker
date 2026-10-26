FROM python:3.11-slim

WORKDIR /app

# Outil HTTP disponible dans le conteneur pour les diagnostics.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p /app/data

# Le port utilisé par Uvicorn et le reverse proxy Nginx.
EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]