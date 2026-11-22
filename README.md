# Meow Speech V2

Nouvelle base de l’application, avec une API AdonisJS indépendante et un client React/TypeScript autonome. Les deux applications sont rangées dans un même monorepo officiel AdonisJS API monorepo; elles peuvent être développées et déployées indépendamment. Le client ne dépend pas d’Inertia et pourra être emballé par Capacitor.

## Démarrage local

Prérequis : Node.js 24+ et npm 11+.

```sh
npm install
npm run dev
```

- API : `http://localhost:3333/api/v1`
- Client React : `http://localhost:5173`
- SQLite : `apps/backend/tmp/db.sqlite3`

Le kit initialise SQLite et les migrations. Pour changer l’URL de l’API côté client, copier `apps/frontend/.env.example` vers `apps/frontend/.env` et modifier `VITE_API_URL`.

## Authentification incluse

L’API utilise les access tokens opaques d’AdonisJS et expose :

| Méthode | Route              | Résultat                                                    |
| ------- | ------------------ | ----------------------------------------------------------- |
| `POST`  | `/auth/signup`     | Crée un compte et renvoie son access token                  |
| `POST`  | `/auth/login`      | Vérifie les identifiants et renvoie un access token         |
| `GET`   | `/account/profile` | Renvoie le profil authentifié                               |
| `POST`  | `/account/logout`  | Révoque le token utilisé pour cette requête                 |
| `GET`   | `/units`           | Renvoie les 15 unités, la progression et leur statut actif |

Les endpoints authentifiés attendent `Authorization: Bearer <token>`. Les mots de passe sont hachés par AdonisJS; le token émis est stocké sous forme hachée en base côté serveur.

Les métadonnées des unités sont partagées et définies côté domaine. La progression `levelsCompleted` est stockée par utilisateur et unité dans `user_unit_progress`; elle vaut `0` au départ. L'entité de domaine `Unit` calcule `isActive` à partir de cette progression : l'unité 1 est active au départ, puis une unité se débloque lorsque la précédente est terminée. `currentLevel` est dérivé de `levelsCompleted`.

Le client contient un écran d’inscription/connexion et un écran de session minimal. Le repository HTTP gère les appels; `useAuth` relie les opérations au cache TanStack Query; les composants restent dans `components/`.

## Organisation

```text
apps/backend/                 API AdonisJS, Lucid, SQLite, access tokens
apps/frontend/src/
  domain/                      types côté client
  infrastructure/http/         API client et adaptateur de token
  infrastructure/repositories/ opérations d’auth via HTTP
  application/                 hook React Query d’authentification
  components/                  écrans React
  ui/                          composition de l’application et styles
```

Le frontend et l’API sont deux **workspaces indépendants** du même dépôt Git : une seule base de changements coordonnée, tout en gardant deux applications livrables séparément. Deux dépôts Git séparés ne sont pas nécessaires pour Capacitor; on pourra les créer plus tard si l’organisation des équipes, les permissions ou les cycles de publication l’exigent.

## Préparer le déploiement et Capacitor

- En développement, l’API autorise les origines nécessaires au client local. En production, définir `CORS_ORIGINS` comme une liste explicite séparée par des virgules dans l’environnement du backend. Y ajouter les origines web et celles utilisées par les WebViews Capacitor effectivement ciblées.
- `apps/frontend/src/infrastructure/http/token_store.ts` utilise `localStorage` pour rendre la base web immédiatement fonctionnelle. Avant une publication native, remplacer cet adaptateur par un stockage sécurisé natif et vérifier les origines CORS Capacitor de chaque plateforme.
- Pour le développement sur un appareil ou un émulateur, définir `VITE_API_URL` avec une adresse de l’API joignable depuis cet appareil (pas `localhost` si l’API tourne sur l’ordinateur).
- Le plugin Capacitor, les projets iOS/Android et la publication App Store / Play Store ne sont pas inclus : cette base reste centrée sur React, l’API et l’authentification.

## Vérifications

```sh
npm run typecheck
npm run build -w frontend
npm run build -w backend
```
