# Pharmacy — Application full-stack conteneurisée

Application de gestion de pharmacie composée de trois conteneurs orchestrés
par Docker Compose :

- un **reverse proxy Nginx** qui expose l'application sur le port 80 ;
- un **frontend React** compilé et servi par Nginx ;
- une **API FastAPI** (Uvicorn) adossée à une base **SQLite** persistée sur
  l'hôte.

---

## Sommaire

- [Architecture](#architecture)
- [Justification des limites de ressources](#justification-des-limites-de-ressources)
- [Démarrage rapide](#démarrage-rapide)
- [Benchmarks CPU et mémoire](#benchmarks-cpu-et-mémoire)
- [Ressources consultées](#ressources-consultées)

---

## Architecture

```mermaid
flowchart LR
    browser["Navigateur web"]

    subgraph compose["Docker Compose - réseau app-network (bridge)"]
        nginx["nginx<br/>Reverse proxy<br/>port hôte 80 → conteneur 80<br/>(pas de limite : trafic faible)"]
        frontend["frontend<br/>Nginx + fichiers React statiques<br/>0,5 CPU / 256 MiB<br/>(suffisant : Nginx sert des fichiers, pas de Node au runtime)"]
        backend["backend<br/>FastAPI + Uvicorn :5000<br/>1 CPU / 512 MiB<br/>(1 worker → 1 CPU exploitable)"]

        nginx -->|"/ : fichiers de l'application"| frontend
        nginx -->|"/api/* : requêtes API"| backend
    end

    storage[("Hôte : backend_data/<br/>pharmacy.db")]

    browser -->|"HTTP :80 - page et fichiers statiques"| nginx
    browser -->|"GET/POST /api/produits"| nginx
    backend -->|"SQLite : /app/data/pharmacy.db<br/>bind mount persistant"| storage
```

Le navigateur accède à l'application via le port 80 publié par Nginx. Nginx
sert les fichiers statiques du frontend et transmet les requêtes `/api/*` au
backend. La base SQLite du backend est conservée sur l'hôte dans
`backend_data/`.

---

## Justification des limites de ressources

Les plafonds donnent davantage de ressources au backend qu'au frontend, car
leurs rôles et leurs traitements diffèrent. Ce sont des **choix de départ pour
une stack de démonstration**, et non des besoins établis par des mesures de
charge de l'application.

- **Frontend — 0,5 CPU / 256 MiB.** Le conteneur exécute Nginx pour servir des
  fichiers statiques déjà construits ; il ne fait pas tourner React ni son
  processus de compilation. Une limite inférieure à celle du backend est donc
  cohérente avec son rôle de serveur de contenu statique, pour un trafic de
  démonstration.
- **Backend — 1 CPU / 512 MiB.** Le conteneur exécute Python, FastAPI, Uvicorn
  et accède à SQLite. Il reçoit donc un plafond supérieur à celui du frontend
  pour laisser plus de marge à l'exécution de l'API et à ses traitements. La
  commande `uvicorn app:app` démarre un seul worker ; le plafond d'un CPU est
  cohérent avec cette configuration simple, mais ne garantit pas à lui seul
  que la capacité ou la mémoire suffiront sous charge.
- **Nginx (reverse proxy) — aucun plafond configuré.** Le service est laissé
  sans limite explicite afin de ne pas ajouter un plafond arbitraire au point
  d'entrée de la stack. En contrepartie, sa consommation n'est pas bornée par
  Compose.

Ces raisons justifient l'**ordre de grandeur relatif** des choix, pas leur
adéquation à une charge précise. Les benchmarks Sysbench de la section suivante
illustrent l'effet de limites CPU et mémoire sur des scénarios synthétiques ;
ils ne mesurent pas les besoins de cette application. Pour confirmer ou
ajuster les plafonds, il faudrait tester la stack avec des requêtes
représentatives et observer la consommation CPU et mémoire, les temps de
réponse et les erreurs.

---

## Démarrage rapide

### Prérequis

- Docker Engine 24+ et Docker Compose v2
- (Optionnel) Python 3.11 pour lancer le backend hors conteneur

### Lancer la stack

```sh
docker compose up --build
```

L'application est accessible sur <http://localhost>.

### Arrêter la stack

```sh
docker compose down
```

Les données SQLite restent dans `backend_data/` , elles survivent
donc à l'arrêt et au remplacement du conteneur backend.

### Structure du dépôt

```
.
├── nginx/            # Configuration du reverse proxy
├── frontend/         # Dockerfile React + fichiers statiques
├── backend/          # Dockerfile FastAPI + code applicatif
├── backend_data/     # Base SQLite persistée (bind mount)
├── benchmarks/       # Scripts et rapports de benchmark
```

---

## Benchmarks CPU et mémoire

Comparer les résultats avec les mêmes paramètres. Sans option de limite, le
conteneur utilise les ressources disponibles sur l'hôte.

### CPU

```sh
# Sans limite CPU
docker run --rm severalnines/sysbench sysbench cpu --threads=4 run

# Limité à 2 CPU
docker run --rm --cpus=2 severalnines/sysbench sysbench cpu --threads=4 run

# Limité à 0,5 CPU
docker run --rm --cpus=0.5 severalnines/sysbench sysbench cpu --threads=4 run
```

### Mémoire

Le test utilise un bloc mémoire de 128 MiB et parcourt 1 GiB de données.
Comparer les limites en conservant les mêmes paramètres :

```sh
# Sans limite mémoire
docker run --rm severalnines/sysbench sysbench memory \
  --threads=1 --memory-block-size=128M --memory-total-size=1G run

# Limité à 256 MiB (sans swap)
docker run --rm --memory=256m --memory-swap=256m severalnines/sysbench sysbench memory \
  --threads=1 --memory-block-size=128M --memory-total-size=1G run

# Limité à 512 MiB (sans swap)
docker run --rm --memory=512m --memory-swap=512m severalnines/sysbench sysbench memory \
  --threads=1 --memory-block-size=128M --memory-total-size=1G run
```

Sysbench affiche le débit et le temps d'exécution ; le runtime dépend aussi
de la machine hôte. Une limite mémoire trop basse peut entraîner l'arrêt du
conteneur par manque de mémoire (OOM).

### Lecture des résultats

- **CPU** : comparer le nombre d'événements par seconde entre les trois
  scénarios. Un effondrement avec `--cpus=0.5` signale un goulot
  d'étranglement CPU — à vérifier côté backend si Uvicorn sature.
- **Mémoire** : comparer le débit. Un conteneur tué par OOM (code de sortie
  `137`) signifie que la limite est trop basse pour la charge testée.

### Automatisation sous Windows

Lancer les six scénarios avec le fichier batch fourni :

```bat
benchmarks\resource-benchmark.bat
```

Le script affiche les résultats dans le terminal et crée
`benchmarks\resource-report.md` avec la date, la version de Docker, les
commandes, les sorties Sysbench et le statut de chaque scénario. Le rapport
est remplacé à chaque nouvelle exécution.

---

## Ressources consultées

- [Python package management with uv for Dockerized environments](https://medium.com/@shaliamekh/python-package-management-with-uv-for-dockerized-environments-f3d727795044)
- [FastAPI — créer les tables de la base de données au démarrage](https://fastapi.tiangolo.com/tutorial/sql-databases/#create-database-tables-on-startup)
- [Ajouter SQLite à une application FastAPI](https://timberry.dev/adding-an-sqlite-backend-to-fastapi)
- [Docker benchmark performance](https://oneuptime.com/blog/post/2026-01-16-docker-benchmark-performance/view)