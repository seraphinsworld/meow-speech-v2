# Client React

Client React autonome configuré avec Vite et TypeScript. Pour les commandes de démarrage, la structure des couches et l’authentification, voir le [README de la racine](../../README.md).

Le client consomme l’API via `VITE_API_URL`; il ne rend aucune page côté serveur et ne dépend pas d’Inertia.

L’authentification dépend du contrat `domain/auth_repository.ts`. L’implémentation HTTP est instanciée dans `main.tsx` puis enregistrée dans `application/dependencies.ts`; les tests peuvent remplacer le repository avec `setAuthRepository` puis réinitialiser le registre avec `resetAuthRepository`, sans prop de câblage sur `App`.
