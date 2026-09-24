# SayDo V2 — premières pages

Fondations du cahier personnel numérique SayDo. Reconstruction neuve, sans code de la première expérimentation.

- Code : https://github.com/fifeetch/Saydo
- Publication prévue : https://saydo-helper.web.app
- Projet et site Firebase Hosting : `saydo-helper`

## Fonctionne dans cette version

Une couverture ouvre un cahier à deux pages sur ordinateur, une page sur téléphone. La navigation par intercalaires, la page Aujourd’hui, la boîte d’entrée, les liens directs et les boutons précédent/suivant du navigateur fonctionnent. Les anneaux SVG s’adaptent à la reliure. Les dialogues sont accessibles au clavier et la réduction des animations est respectée.

Il s’agit de l’étape 1 du prompt maître, pas d’un gestionnaire de contenus complet. Aucun compte, aucune donnée personnelle, aucune permission microphone et aucune fausse donnée de rendez-vous. Les textes de la couverture sont décoratifs.

## Développement

Node.js 22 ou ultérieur. Aucune dépendance applicative à installer.

```sh
npm run dev       # http://127.0.0.1:4173
npm test
npm run build     # copie contrôlée de public/ vers dist/
```

Les commandes peuvent aussi être exécutées directement avec `node scripts/serve.mjs`, `node --test tests/*.test.mjs`, `node scripts/build.mjs`.

## Organisation

```text
public/
  index.html              Point d’entrée, français, métadonnées
  styles.css              Papier, couverture, responsive et accessibilité
  assets/                 Grain, anneaux SVG et favicon
  src/
    app.js                Navigation et dialogues
    domain/notebook.js    Contextes, types et modèle de données
    ui/                   Rendu du cahier et icônes
    services/firebase.js  Frontière d’intégration Firebase
scripts/                  Construction et serveur local
tests/                    Routes, séparation type/contexte, configuration
docs/                     Architecture et prompt maître
firebase.json             Hébergement et en-têtes de sécurité
.firebaserc               Projet Firebase cible
```

Le choix de modules JavaScript natifs garde cette première étape simple et sans dépendances. La séparation domaine / interface / services permet d’ajouter une base de données ou de faire évoluer l’interface sans changer le modèle métier.

## Firebase

Seul Hosting est utilisé. Aucun SDK ni service de données n’est activé prématurément. Une future application Web Firebase pourra fournir sa configuration publique via `/__/firebase/init.json` ; l’adaptateur vérifie le projet et tolère son absence. Il n’est pas appelé au démarrage, pour éviter une requête inutile.

Publication depuis un environnement connecté au compte Firebase :

```sh
node scripts/build.mjs
firebase login
firebase deploy --only hosting --project saydo-helper
```

`dist/` contient exclusivement les fichiers publics. Ne jamais déployer la racine du dépôt. Aucun token, mot de passe ou compte de service ne doit entrer dans Git. La configuration publique du SDK Firebase n’est pas une clé privée ; elle n’est pas nécessaire à cette version.

## Prochaines étapes, sur demande

Création et modification des contenus, personnalisation des intercalaires, authentification et synchronisation Firestore, fichiers, rappels, recherche, calendrier et voix. Google Calendar sera une intégration ultérieure.

Avant d’enregistrer des données personnelles : choisir le mode de connexion, créer l’application Web Firebase, choisir la région Firestore et définir/tester les règles d’accès par utilisateur. Aucun choix irréversible de stockage n’est effectué dans cette étape.
