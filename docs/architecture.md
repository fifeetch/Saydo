# Architecture des fondations

## Périmètre

Le prompt maître n°1 exige un socle fonctionnel minimal. L’application n’invente pas de tâches, de rendez-vous ou de notes enregistrées pour imiter les maquettes. Elle reprend leur couverture verte, papier ivoire, intercalaires pastel et reliure métallique avec des états vides honnêtes.

## Navigation et rendu

Routes avec fragment pour conserver les liens directs sur un hébergement statique : `#/`, `#/cahier`, `#/entree`, `#/intercalaire/{id}`. Une route inconnue revient à la couverture. Aucun stockage navigateur : seules la route et l’ouverture d’un dialogue constituent l’état actuel.

Les références visuelles sont les fichiers `01_SayDo_mobile.png`, `02_SayDo_ordinateur.png` et `03_SayDo_accueil_et_famille.png` fournis dans le dossier parent. Les pages sont du HTML utilisable, pas une capture de maquette. Les objets graphiques de reliure utilisent un SVG unique à proportions fixes ; le placement change entre la double page et le mobile.

## Modèle proposé pour les futures données

Chemins prévus (aucune collection créée à ce stade) :

- `users/{uid}/sections/{sectionId}` : `name`, `color`, `order`, `createdAt`, `updatedAt`.
- `users/{uid}/contents/{contentId}` : `type`, `sectionId`, `title`, `body`, `createdAt`, `updatedAt` ; les champs propres à chaque type seront ajoutés avec leur module.

Le type décrit le contenu, l’intercalaire décrit son contexte. `sectionId: null` signifie boîte d’entrée. Un contenu conserve son type lorsqu’on le déplace. Les identifiants d’intercalaires restent stables après renommage ; les libellés actuels sont des valeurs initiales, pas une énumération métier permanente.

Les règles devront limiter l’accès au propriétaire authentifié, valider les types et les références. Prévoir explicitement le déplacement des contenus avant suppression d’un intercalaire. Ne pas activer des règles Firestore ouvertes. Pas de règles déployées avant la création du service et de ses tests.

## Voix

À terme : capture audio/transcription → interprétation d’une intention structurée → validation métier → service de contenus. La transcription ne doit pas écrire directement dans Firestore. Cette frontière permettra d’ajouter une compréhension naturelle sans coupler microphone et affichage. Dans la version actuelle, le bouton explique simplement la fonction à venir et n’accède à aucun périphérique.

## Hébergement

Firebase Hosting, projet/site `saydo-helper`. Politique de sécurité limitée aux ressources du même site ; la politique devra être élargie précisément pour les services Firebase ou le microphone lorsqu’ils seront implémentés. Aucun analytics, cookie, dépendance distante ni service facturé ajouté.
