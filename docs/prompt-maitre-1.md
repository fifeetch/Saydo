# SAYDO V2 — PROMPT MAÎTRE / FONDATIONS DU PROJET

Tu travailles sur une nouvelle application appelée **SayDo V2**.

Il s'agit d'une reconstruction propre depuis zéro. Une ancienne version de SayDo existe, mais elle ne doit pas servir de base technique : elle contient des expérimentations et des choix successifs que nous ne souhaitons pas reproduire.

L'objectif est de construire SayDo V2 progressivement, avec une architecture propre, maintenable et cohérente.

Ce document constitue la **référence principale du projet**. Les futurs développements devront respecter les principes définis ici, sauf instruction explicite contraire.

---

## 1. INFORMATIONS DU PROJET

**Nom de l'application :** SayDo

**Version :** V2

**Dépôt GitHub :**  
[À COMPLÉTER — NOM ET/OU URL DU DÉPÔT GITHUB]

**Projet Firebase :**  
[À COMPLÉTER — NOM / PROJECT ID / INFORMATIONS UTILES DU PROJET FIREBASE]

**Références visuelles officielles :**  
[À COMPLÉTER — MAQUETTES / CAPTURES / FICHIERS DE RÉFÉRENCE]

Ces références visuelles devront être considérées comme prioritaires lorsqu'elles seront fournies.

---

# 2. VISION DE SAYDO

SayDo est un **cahier personnel numérique**.

Son objectif est de permettre à une personne de centraliser simplement sa vie quotidienne dans un même espace :

- notes ;
- tâches ;
- listes ;
- rendez-vous et événements ;
- rappels ;
- photos ;
- documents et fichiers ;
- informations personnelles utiles.

L'utilisateur doit pouvoir :

**écrire, parler, ranger et retrouver.**

SayDo ne doit pas devenir un logiciel complexe de gestion de projet ou une usine à gaz.

La simplicité d'utilisation est prioritaire.

---

# 3. CONCEPT DU CAHIER

L'interface principale de SayDo repose visuellement sur un **cahier/classeur personnel avec reliure et intercalaires**.

Ce concept n'est pas seulement décoratif.

Il constitue la logique de navigation principale de l'application.

Les intercalaires correspondent à des **contextes de vie**.

Exemples :

- Famille
- Maison
- Personnel
- Travail
- Voyage

Ces exemples ne doivent pas être imposés définitivement.

L'utilisateur doit pouvoir personnaliser ses intercalaires :

- créer ;
- renommer ;
- supprimer ;
- réordonner ;
- personnaliser leur apparence dans les limites du design SayDo.

---

# 4. PRINCIPE FONDAMENTAL DES DONNÉES

Ne pas confondre **type de contenu** et **intercalaire**.

Un contenu possède un type.

Par exemple :

- note ;
- tâche ;
- liste ;
- événement ;
- rappel ;
- photo ;
- document.

Indépendamment de son type, ce contenu peut être rattaché à un **intercalaire**.

Exemple :

Une tâche :

> Prendre rendez-vous chez le dentiste

peut être rattachée à :

> Famille

Un même intercalaire pourra donc contenir différents types de contenus.

Cette séparation **TYPE DE CONTENU / CONTEXTE-INTERCALAIRE** est un principe structurel de SayDo V2 et doit être respectée dans l'architecture des données.

---

# 5. BOÎTE D'ENTRÉE

Lorsqu'un contenu est créé sans intercalaire spécifié, il doit pouvoir être placé dans une **boîte d'entrée**.

L'utilisateur pourra ensuite le classer.

L'objectif est de permettre une capture extrêmement rapide sans obliger l'utilisateur à réfléchir immédiatement au rangement.

---

# 6. CALENDRIER

SayDo disposera d'un calendrier.

À terme, il devra permettre une intégration/synchronisation avec **Google Agenda / Google Calendar**.

Le calendrier pourra présenter une vue globale.

Lorsqu'un utilisateur consulte un intercalaire particulier, il devra également être possible d'afficher les événements liés à cet intercalaire.

L'intégration complète Google Calendar ne doit PAS nécessairement être développée pendant cette première étape.

Elle fera l'objet d'une étape ultérieure.

---

# 7. VOIX — FONCTION CENTRALE

La voix est une fonction majeure de SayDo.

Elle ne doit pas être considérée comme un simple bouton de dictée ajouté à l'interface.

À terme, l'utilisateur devra pouvoir parler naturellement à SayDo.

Exemples :

> Crée une note. Titre : idée voyage. Texte : regarder les trains pour l'Italie.

ou :

> Crée une tâche : prendre rendez-vous chez le dentiste. Attache à Famille.

À terme, SayDo devra pouvoir comprendre différents éléments d'une instruction :

- intention ;
- type de contenu ;
- titre éventuel ;
- contenu ;
- date ;
- heure ;
- rappel ;
- intercalaire/context associé.

L'objectif futur est également de permettre des formulations plus naturelles telles que :

> Demain à 15 heures dentiste.

ou :

> Pense à acheter du liquide lave-glace.

SayDo pourra alors déterminer le type de contenu approprié.

IMPORTANT :

Ne pas développer prématurément toute cette intelligence vocale lors de cette première étape.

L'architecture doit simplement éviter de rendre cette évolution difficile par la suite.

---

# 8. AUTRES FONCTIONS PRÉVUES

SayDo V2 devra pouvoir accueillir progressivement :

- recherche globale ;
- page Aujourd'hui ;
- rappels associés aux contenus ;
- ajout de photos ;
- ajout de fichiers ;
- éventuellement scan de documents ;
- classement et déplacement des contenus entre intercalaires.

Ces fonctions seront développées progressivement.

Ne pas toutes les implémenter maintenant.

---

# 9. IDENTITÉ VISUELLE

SayDo possède une identité visuelle forte basée sur le **cahier/classeur physique**.

Les maquettes fournies doivent être considérées comme des **références visuelles**, et non comme une vague source d'inspiration.

Lorsque des maquettes sont jointes à une demande, rechercher la plus grande fidélité raisonnablement possible concernant notamment :

- proportions ;
- disposition ;
- cahier ;
- pages ;
- reliure ;
- anneaux ;
- intercalaires ;
- palette ;
- typographies ;
- espacements ;
- marges ;
- ombres ;
- reliefs ;
- profondeur ;
- hiérarchie visuelle ;
- animations ;
- comportement d'ouverture du cahier.

## RÈGLE DE FIDÉLITÉ VISUELLE

**La fidélité aux maquettes validées est prioritaire sur l'interprétation personnelle du design.**

Ne pas redessiner arbitrairement une interface déjà définie.

---

# 10. ATTENTION PARTICULIÈRE : RELIURE ET ANNEAUX

Une ancienne version de SayDo présentait notamment des problèmes de représentation des anneaux du cahier.

Cette erreur ne doit pas être reproduite.

Les anneaux doivent :

- avoir des proportions cohérentes ;
- sembler réellement relier les pages ;
- être correctement positionnés ;
- conserver leur cohérence lors du redimensionnement ;
- ne pas donner l'impression d'éléments décoratifs flottants ou mal alignés.

Ne pas utiliser une construction CSS approximative simplement parce qu'elle est rapide.

Si une forme graphique complexe nécessite une autre approche — par exemple SVG, asset graphique ou autre solution appropriée — utiliser la méthode donnant le meilleur résultat visuel et technique.

---

# 11. RESPONSIVE

SayDo doit fonctionner au minimum sur :

- smartphone ;
- ordinateur.

Il s'agit de **la même application**, mais l'interface doit intelligemment exploiter l'espace disponible.

Ne pas simplement agrandir l'interface mobile sur ordinateur.

Le concept du cahier doit rester reconnaissable et cohérent sur les différents formats.

Les comportements responsive précis seront affinés lors des étapes consacrées à l'interface.

---

# 12. FIREBASE

Firebase sera le backend principal de SayDo V2.

Le projet devra être conçu pour pouvoir utiliser notamment, selon les besoins futurs :

- Firebase Authentication ;
- Cloud Firestore ;
- Firebase Storage ;
- éventuellement Cloud Functions ;
- éventuellement Firebase Hosting.

Ne pas activer ou complexifier inutilement des services dont nous n'avons pas encore besoin.

La structure Firestore devra être réfléchie avant de multiplier les collections.

---

# 13. GITHUB

GitHub est la référence pour le code source et son historique.

Le développement doit rester propre et versionnable.

Ne jamais enregistrer dans le dépôt :

- mots de passe ;
- clés privées ;
- tokens ;
- secrets ;
- identifiants sensibles.

Utiliser les mécanismes appropriés de configuration et d'environnement lorsque nécessaire.

---

# 14. QUALITÉ DU CODE

Privilégier :

- architecture claire ;
- composants réutilisables ;
- séparation des responsabilités ;
- noms compréhensibles ;
- code maintenable ;
- dépendances limitées au nécessaire ;
- absence de duplication inutile ;
- structure permettant les futures évolutions de SayDo.

Ne pas surarchitecturer l'application.

Ne pas ajouter une bibliothèque importante pour résoudre un problème trivial.

---

# 15. RÈGLE CONTRE L'ACCUMULATION DE FONCTIONS

SayDo V2 repart volontairement de zéro parce que la première expérimentation s'est développée dans plusieurs directions et a accumulé trop d'éléments.

Ne pas ajouter spontanément de nouvelles fonctionnalités.

Ne pas transformer SayDo en :

- gestionnaire de projets complexe ;
- outil Kanban ;
- CRM ;
- système de bases de données générique ;
- tableau de bord rempli de widgets ;
- outil de productivité surchargé.

Toute nouvelle fonction importante devra être explicitement demandée.

Le filtre conceptuel est :

> **Cette fonction a-t-elle naturellement sa place dans mon cahier personnel ?**

---

# 16. MÉTHODE DE DÉVELOPPEMENT

SayDo V2 sera construit par étapes.

Ce prompt constitue le **Prompt maître n°1**.

Les prompts suivants ajouteront progressivement les différentes parties de l'application.

À chaque étape :

1. analyser l'existant avant de modifier le code ;
2. respecter les décisions déjà prises ;
3. ne pas casser une fonctionnalité validée ;
4. ne pas anticiper inutilement les étapes futures ;
5. tester ce qui vient d'être développé ;
6. vérifier les erreurs et avertissements ;
7. conserver une architecture compatible avec les évolutions prévues ;
8. lorsque l'interface est concernée, comparer le résultat aux références visuelles fournies.

---

# 17. INTERDICTION D'IMPROVISER SUR UNE AMBIGUÏTÉ IMPORTANTE

Si une décision importante concernant :

- l'architecture ;
- les données ;
- Firebase ;
- la sécurité ;
- le design ;
- l'expérience utilisateur ;

n'est pas définie et qu'un mauvais choix serait difficile à corriger ultérieurement :

**ne pas inventer arbitrairement la réponse.**

Signaler clairement le point nécessitant une décision avant de construire une solution lourde autour d'une hypothèse.

---

# 18. OBJECTIF DE CETTE PREMIÈRE ÉTAPE

IMPORTANT :

**Ne construis pas toute l'application décrite dans ce document maintenant.**

Ce document définit la vision et les règles du projet.

Pour cette première étape :

1. prends connaissance du dépôt et de son état ;
2. vérifie la configuration du projet ;
3. propose/établis une structure initiale propre adaptée à SayDo V2 ;
4. prépare correctement l'intégration Firebase nécessaire aux fondations, sans développer prématurément tous les services futurs ;
5. mets en place la structure permettant les futurs modules ;
6. crée uniquement le minimum nécessaire pour disposer d'une base fonctionnelle propre ;
7. ne développe pas encore l'ensemble des notes, tâches, calendrier, commande vocale, Google Calendar, recherche, etc.

Avant toute décision technique structurante non imposée par l'existant, explique brièvement le choix retenu et sa raison.

À la fin de cette étape, indique clairement :

- ce qui a été créé ;
- la structure du projet ;
- ce qui fonctionne réellement ;
- les éventuelles configurations Firebase restant à effectuer ;
- les points nécessitant une décision ;
- ce qui est volontairement laissé pour les prochaines étapes.

**Ne poursuis pas spontanément vers l'étape suivante.**

Attends le prochain prompt.

---

# PRINCIPE FINAL

SayDo doit rester :

**simple à utiliser, personnel, visuel, rapide et cohérent.**

L'utilisateur doit progressivement avoir l'impression d'utiliser son propre cahier numérique plutôt qu'un logiciel de gestion complexe.

La technologie doit servir cette sensation, et non prendre le dessus sur elle.
