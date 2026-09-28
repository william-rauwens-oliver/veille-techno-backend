# Kanban Board API

API REST d'un **Kanban Board** développée avec **NestJS**, **Prisma** et **PostgreSQL**, dans le cadre d'une veille technologique backend comparant NestJS, Symfony et Spring Boot.

L'API permet d'inscrire et connecter des utilisateurs, de gérer leurs droits, et de créer / modifier / supprimer des listes et des cartes. Toute la documentation est exposée via **Swagger** sur `/api`.

## Sommaire

- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Documentation Swagger](#documentation-swagger)
- [Modèle de données](#modèle-de-données)
- [Endpoints](#endpoints)
- [API GraphQL](#api-graphql)
- [Authentification et droits](#authentification-et-droits)
- [Données de démonstration (seed)](#données-de-démonstration-seed)
- [Tests](#tests)
- [Performance et optimisation](#performance-et-optimisation)
- [Scripts npm](#scripts-npm)
- [Structure du projet](#structure-du-projet)

## Stack technique

| Rôle                 | Technologie                          |
| -------------------- | ------------------------------------ |
| Framework            | NestJS 12 (Node.js, TypeScript, ESM) |
| ORM                  | Prisma 6                             |
| Base de données      | PostgreSQL 16 (via Docker)           |
| Authentification     | JWT (`@nestjs/jwt`)                  |
| Hash de mot de passe | bcryptjs                             |
| Validation           | class-validator / class-transformer  |
| Documentation        | Swagger (`@nestjs/swagger`)          |
| API alternative      | GraphQL (`@nestjs/graphql` + Apollo) |
| Tests                | Vitest + Supertest                   |

## Fonctionnalités

- Inscription et connexion d'un utilisateur (JWT)
- Modification des informations d'un utilisateur, **droits (rôle) inclus**
- Création, lecture, modification et suppression de listes
- Création, lecture, modification et suppression de cartes dans une liste
- Documentation de l'API via Swagger (`/api`)
- API **GraphQL** alternative sur `/graphql` (query et mutations sur les listes et cartes)
- Données de démonstration (seed) et tests d'intégration

## Prérequis

- **Node.js** >= 20
- **npm** >= 10
- **Docker** (pour lancer PostgreSQL)

## Installation et lancement

Installez d'abord les dépendances du projet.

```bash
npm install
```

Créez ensuite le fichier d'environnement à partir de l'exemple fourni.

```bash
cp .env.example .env
```

Démarrez PostgreSQL dans un conteneur Docker.

```bash
docker compose up -d
```

Appliquez les migrations et générez le client Prisma.

```bash
npx prisma migrate dev
```

Lancez enfin l'API en mode développement.

```bash
npm run start:dev
```

L'API démarre sur `http://localhost:3000` et Swagger est disponible sur `http://localhost:3000/api`.

Le fichier `docker-compose.yml` mappe le port hôte `5433` vers le port `5432` du conteneur, afin d'éviter tout conflit avec un PostgreSQL déjà présent sur la machine, par exemple celui de MAMP. Le `DATABASE_URL` du fichier `.env.example` pointe donc déjà sur le port `5433`.

### Variables d'environnement

| Variable         | Description                             | Exemple                                                          |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`   | Chaîne de connexion PostgreSQL (Prisma) | `postgresql://kanban:kanban@localhost:5433/kanban?schema=public` |
| `JWT_SECRET`     | Secret de signature des tokens JWT      | `dev-secret-change-me`                                           |
| `JWT_EXPIRES_IN` | Durée de validité du token              | `1d`                                                             |
| `PORT`           | Port HTTP de l'API                      | `3000`                                                           |

## Documentation Swagger

Une fois l'API lancée, ouvrez `http://localhost:3000/api`.

Vous y trouvez tous les endpoints regroupés par tag (`auth`, `users`, `lists`, `cards`). Pour tester les routes protégées :

1. Appelez `POST /api/auth/login` (ou `/api/auth/register`) pour obtenir un `accessToken`.
2. Cliquez sur **Authorize** en haut de Swagger et collez le token.
3. Toutes les requêtes suivantes seront authentifiées.

## Modèle de données

```
User (id, email, name, password, role[USER|ADMIN], createdAt, updatedAt)
  └── 1..n List (id, title, position, ownerId, createdAt, updatedAt)
                └── 1..n Card (id, title, description, position, listId, createdAt, updatedAt)
```

- Un utilisateur possède plusieurs listes.
- Une liste contient plusieurs cartes.
- Supprimer une liste supprime ses cartes en cascade.
- Chaque utilisateur ne voit et ne gère que ses propres listes et cartes.

## Endpoints

Toutes les routes REST sont préfixées par `/api` (c'est aussi l'URL de la documentation Swagger).

### Auth (`/api/auth`)

| Méthode | Route                | Auth | Description                      |
| ------- | -------------------- | ---- | -------------------------------- |
| POST    | `/api/auth/register` | —    | Inscrire un nouvel utilisateur   |
| POST    | `/api/auth/login`    | —    | Se connecter et récupérer un JWT |

### Users (`/api/users`)

| Méthode | Route            | Auth        | Description                                            |
| ------- | ---------------- | ----------- | ----------------------------------------------------- |
| GET     | `/api/users/me`  | JWT         | Récupérer le profil de l'utilisateur connecté         |
| GET     | `/api/users`     | JWT (ADMIN) | Lister tous les utilisateurs                           |
| GET     | `/api/users/:id` | JWT         | Récupérer un utilisateur                               |
| PATCH   | `/api/users/:id` | JWT         | Modifier un utilisateur (le champ `role` = admin only)|

### Lists (`/api/lists`)

| Méthode | Route            | Auth | Description                           |
| ------- | ---------------- | ---- | ------------------------------------- |
| POST    | `/api/lists`     | JWT  | Créer une liste                       |
| GET     | `/api/lists`     | JWT  | Lister ses listes (avec leurs cartes) |
| GET     | `/api/lists/:id` | JWT  | Récupérer une liste et ses cartes     |
| PATCH   | `/api/lists/:id` | JWT  | Modifier une liste                    |
| DELETE  | `/api/lists/:id` | JWT  | Supprimer une liste (et ses cartes)   |

### Cards (`/api/cards` et `/api/lists/:listId/cards`)

| Méthode | Route                      | Auth | Description                                        |
| ------- | -------------------------- | ---- | ------------------------------------------------- |
| GET     | `/api/lists/:listId/cards` | JWT  | Lister les cartes d'une liste                     |
| POST    | `/api/lists/:listId/cards` | JWT  | Créer une carte dans une liste                    |
| POST    | `/api/cards`               | JWT  | Créer une carte (`listId` dans le body)           |
| GET     | `/api/cards/:id`           | JWT  | Récupérer une carte                               |
| PATCH   | `/api/cards/:id`           | JWT  | Modifier une carte (titre, description, position) |
| DELETE  | `/api/cards/:id`           | JWT  | Supprimer une carte                               |

## API GraphQL

En complément de l'API REST, une API **GraphQL** est exposée sur `http://localhost:3000/graphql` (schéma généré en code-first). Elle réutilise les mêmes services et la même sécurité JWT (en-tête `Authorization: Bearer <token>`).

Exemples :

```graphql
query {
  lists {
    id
    title
    position
    cards { id title }
  }
}

mutation {
  createList(input: { title: "To Do" }) {
    id
    title
  }
}

mutation {
  createCard(input: { title: "Ma tâche", listId: "<listId>" }) {
    id
    title
  }
}
```

## Authentification et droits

- L'authentification repose sur des **JWT Bearer**. Le token est renvoyé par `/api/auth/register` et `/api/auth/login`.
- Les routes protégées utilisent `AuthGuard` : il lit l'en-tête `Authorization`, vérifie le token avec `JwtService` et attache l'utilisateur à la requête.
- La gestion des droits repose sur un rôle `USER` ou `ADMIN` :
  - Un utilisateur peut modifier son propre compte.
  - Seul un **ADMIN** peut modifier le `role` d'un utilisateur (via `RolesGuard` et le décorateur `@Roles(Role.ADMIN)`) et lister tous les utilisateurs.
- Chaque utilisateur est isolé : il ne peut agir que sur ses propres listes et cartes.

## Données de démonstration (seed)

Un script de seed insère des données de démonstration : deux utilisateurs et un tableau prêt à l'emploi.

```bash
npm run db:seed
```

| Email               | Mot de passe | Rôle  |
| ------------------- | ------------ | ----- |
| `admin@example.com` | `secret123`  | ADMIN |
| `jane@example.com`  | `secret123`  | USER  |

L'utilisateur `jane` reçoit trois listes (`To Do`, `En cours`, `Terminé`) avec quelques cartes.

## Tests

La suite est composée de tests d'intégration qui démarrent l'application et appellent les vraies routes REST et GraphQL à travers la base PostgreSQL, qui doit donc être lancée.

```bash
npm test
```

## Performance et optimisation

NestJS s'appuie sur le runtime **non bloquant** de Node.js : les entrées/sorties (base de données, réseau) ne bloquent pas le thread principal, ce qui permet de tenir de nombreuses requêtes simultanées avec une faible empreinte mémoire. Plusieurs pistes permettent d'aller plus loin :

- **Index de base de données** : ajouter des index Prisma sur les colonnes filtrées (`ownerId` des listes, `listId` des cartes) pour accélérer les lectures.
- **Pagination** : paginer `GET /api/lists` et les cartes quand les volumes augmentent, plutôt que de tout renvoyer.
- **Cache** : mettre en cache les réponses de lecture fréquentes (par exemple avec `@nestjs/cache-manager` ou Redis).
- **Sélection de champs** : ne demander que les champs nécessaires (Prisma `select`, ou la sélection native de GraphQL) pour réduire la charge.
- **Scalabilité horizontale** : l'API étant *stateless* (JWT), elle peut être répliquée derrière un load balancer sans session partagée.

## Scripts npm

| Script               | Rôle                                  |
| -------------------- | ------------------------------------- |
| `npm run start:dev`  | API en mode watch                     |
| `npm run build`      | Compilation TypeScript                |
| `npm run start:prod` | Lancer le build (`dist/main`)         |
| `npm test`           | Tests d'intégration (REST + GraphQL)  |
| `npm run db:seed`    | Insérer les données de démonstration  |
| `npm run lint`       | Analyse statique (oxlint)             |

## Structure du projet

```
src/
├── main.ts
├── app.module.ts
├── prisma/
├── auth/
│   ├── guards/
│   └── decorators/
├── users/
├── lists/
├── cards/
└── graphql/
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
docker-compose.yml
```

- `graphql/` regroupe les modèles, resolvers et le guard de l'API GraphQL.
- `prisma/seed.ts` insère les données de démonstration.

- `main.ts` démarre l'application et configure Swagger et la validation des données.
- `app.module.ts` est le module racine qui assemble tous les autres modules.
- `prisma/` contient le `PrismaService` et le module global de connexion à la base.
- `auth/` gère l'inscription, la connexion et les JWT, avec ses guards (`AuthGuard`, `RolesGuard`) et ses décorateurs (`@CurrentUser`, `@Roles`).
- `users/` gère la consultation et la modification des utilisateurs ainsi que leurs droits.
- `lists/` gère les opérations sur les listes.
- `cards/` gère les opérations sur les cartes.
- `prisma/schema.prisma` décrit le modèle de données et `prisma/migrations/` contient les migrations SQL.
- `docker-compose.yml` définit le conteneur PostgreSQL.
