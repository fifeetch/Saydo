# Architecture SayDo V2

## Données et droits

Le SDK Web Firebase utilise l’authentification par e-mail et mot de passe et Firestore. Les collections sont `users/{uid}/sections/{sectionId}` et `users/{uid}/contents/{contentId}`. Chaque document est protégé par [`firestore.rules`](../firestore.rules), qui vérifie l’UID et valide les champs. `sectionId: null` signifie que le contenu se trouve dans la boîte d’entrée. Les contenus sont d’abord déplacés vers la boîte d’entrée avant suppression d’un intercalaire.

La configuration de l’application Firebase Web est intégrée au bundle ; elle n’est pas secrète. Aucune clé privée, aucun mot de passe et aucun compte de service ne sont inclus.

## Contenus et voix

Les notes, listes et événements sont enregistrés comme documents Firestore. Une pièce jointe conserve ses métadonnées dans Firestore, tandis que ses octets requièrent Firebase Storage. La dictée utilise l’API de reconnaissance vocale du navigateur lorsqu’elle est disponible, suit une syntaxe explicite et ouvre un formulaire de relecture. Elle ne déclenche jamais d’écriture directe.

## Publication

Le script de build regroupe le SDK dans `dist/app.js`; le site statique est servi depuis `dist/`. Les en-têtes CSP autorisent les seuls services Firebase nécessaires et le microphone pour l’origine du site. Les routes restent des fragments pour conserver la navigation sur Firebase Hosting.
