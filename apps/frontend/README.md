# Client React

Client React autonome configuré avec Vite et TypeScript. Pour les commandes de démarrage, la structure des couches et l’authentification, voir le [README de la racine](../../README.md).

Le client consomme l’API via `VITE_API_URL`; il ne rend aucune page côté serveur et ne dépend pas d’Inertia.

## Application native (Capacitor)

Les projets iOS et Android se trouvent dans `ios/` et `android/`. Ils embarquent le bundle Vite local (`dist/`) : la configuration Capacitor ne pointe pas vers le site distant. Le mode Capacitor utilise l’API V2 de production définie dans `.env.capacitor`.

Depuis la racine du monorepo :

```sh
npm run cap:sync --workspace apps/frontend
npm run cap:open:ios --workspace apps/frontend
npm run cap:open:android --workspace apps/frontend
```

`cap:sync` reconstruit le client avec le mode Capacitor, puis copie les ressources et synchronise les plugins sur les deux plateformes. Les builds web standards continuent d’utiliser la configuration Vite habituelle.

Les jetons navigateur restent dans `localStorage`; sur iOS et Android, le client utilise respectivement le Keychain et le Keystore via le plugin secure storage. L’API V2 conserve ses jetons bearer révocables. Le backend autorise les origines des WebViews natives Capacitor (`capacitor://localhost` sur iOS et `https://localhost` sur Android) en plus des origines web configurées.

La synchronisation des plateformes est configurée, mais la signature, l’archive de distribution et la publication App Store / Google Play restent à faire.

L’authentification dépend du contrat `domain/auth_repository.ts`. L’implémentation HTTP est instanciée dans `main.tsx` puis enregistrée dans `application/dependencies.ts`; les tests peuvent remplacer le repository avec `setAuthRepository` puis réinitialiser le registre avec `resetAuthRepository`, sans prop de câblage sur `App`.
