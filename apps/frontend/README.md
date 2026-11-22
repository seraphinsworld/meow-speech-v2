# Client React

Client React autonome configuré avec Vite et TypeScript. Pour les commandes de démarrage, la structure des couches et l’authentification, voir le [README de la racine](../../README.md).

Le client consomme l’API via `VITE_API_URL`; il ne rend aucune page côté serveur et ne dépend pas d’Inertia.

L’authentification dépend du contrat `domain/auth_repository.ts`. Son implémentation HTTP (`HttpAuthRepository`) est construite dans `main.tsx` et injectée dans l’application. Les tests peuvent fournir un faux repository à `App` ou `useAuth` sans dépendre du réseau ni du stockage réel du token.
