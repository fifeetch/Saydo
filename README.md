# SayDo V2

Cahier personnel numérique adapté aux téléphones et ordinateurs. Les notes, listes, événements et réglages d’intercalaires se synchronisent dans Firestore, sous le compte Google de la personne connectée.

- Dépôt : https://github.com/fifeetch/Saydo
- Application : https://saydo-helper.web.app
- Projet Firebase : `saydo-helper`

## Fonctionnalités

- Connexion Google et données privées par utilisateur.
- Notes, listes avec cases à cocher, événements avec date/heure/lieu.
- Intercalaires modifiables et boîte d’entrée ; supprimer un intercalaire déplace son contenu dans la boîte d’entrée.
- Dictée en français dans les navigateurs compatibles ; la personne relit et confirme les champs avant l’écriture.
- Les métadonnées de fichiers sont associées aux contenus. Les octets de fichiers nécessitent Firebase Storage et un bucket actif.

Les documents sont stockés sous `users/{uid}/sections/{sectionId}` et `users/{uid}/contents/{contentId}`. Les règles de [`firestore.rules`](firestore.rules) n’autorisent que la personne connectée propriétaire de ces chemins. Aucun contenu fictif n’est créé.

## Lancer et vérifier

Node.js 22 ou ultérieur :

```sh
npm install
npm test
npm run build
npm run dev # http://127.0.0.1:4173
```

Le script de build regroupe le SDK Firebase dans `dist/app.js`; Firebase Hosting publie uniquement `dist/`.

## Publication Firebase

```sh
firebase deploy --only firestore:rules,hosting --project saydo-helper
```

La configuration Web Firebase est publique par conception. Les règles Firestore, et non la clé de configuration, protègent les données. Pour activer l’ajout et le téléchargement de fichiers, créer/activer Firebase Storage sur le projet, déployer des règles Storage limitées à l’utilisateur, puis publier à nouveau. L’application limite les fichiers à 10 Mo.
