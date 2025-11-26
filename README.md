# 🚆 Défi Full stack - Routage de Train & Statistiques
test
Bienvenue dans notre défi technique !  
Avant même l’envoi de ton CV, nous te proposons de passer par cette étape pratique. Pourquoi ? Parce que nous croyons que **le code parle plus fort que les mots**.

Ce défi est ton ticket d’entrée : il te permet de nous montrer l’étendue de tes capacités à **collaborer, analyser et livrer du code de qualité**. Tu le réalises chez toi, dans ton environnement, avec tes outils, mais l’objectif est de voir comment tu t’adaptes à notre culture technique et à nos pratiques **DevSecOps**.

---

## 🤝 Esprit du défi
Ce défi est autant une **démonstration de tes compétences** qu’une **simulation de collaboration** dans notre environnement.  
Nous ne cherchons pas la perfection : nous voulons voir ta capacité à t’approprier un contexte technique exigeant, à produire du code de qualité et à réfléchir comme un membre de l’équipe.

Tu es invité à démontrer ta capacité à :
- Travailler avec des outils similaires aux nôtres (**Docker, Composer, GitLab, PHPUnit**, etc.)
- Appliquer des pratiques comme **l’analyse statique**, le **TDD**, le **DDD** et l’**intégration/déploiement continus**
- Produire un code **propre, maintenable et réfléchi**, comme si tu faisais déjà partie de l’équipe

> 💡 Conseil : documente tes choix, structure ton code et montre-nous comment tu raisonnes. C’est tout aussi important que le résultat final.

---

## 🧩 Notre environnement
Nous produisons des applications web modernes, sécurisées et performantes, en utilisant principalement :
- **Backend** : PHP 8 (Symfony 7 et CakePHP 5)
- **Frontend** : Vue.js 3 + Vuetify 3 + TypeScript
- **Tests** : PHPUnit, Vitest, Jest
- **Linter** : PHPCS, ESLint, Prettier
- **UI/UX** : Storybook
- **Base de données** : PostgreSQL ou MariaDB
- **Infrastructure** : Docker, Docker Compose, TeamCity (CI/CD), Gitlab (code versioning)
- **Méthodologies** : TDD, DDD, XP

> 💡 Conseil : inspire-toi de nos pratiques et de nos outils.

---

# 🧾 Instructions pour réaliser le défi
Tu dois réaliser une solution à minimum deux niveaux. Un backend PHP 8 exposant une API REST conforme à la spécification OpenAPI fournie ainsi qu'un frontend TypeScript consommant cette API.

## Le contexte
Dans le métier de la circulation ferroviaire, les trajets de chaque train sont répertoriés dans un système de gestion du trafic. Un train circule sur une ligne, ces lignes sont parfois connectées, permettant à un train de circuler sur plusieurs lignes.
Chaque trajet est associé à un code analytique, qui permet de catégoriser le type de trajet (ex : fret, passager, maintenance, etc.).
Les données de statistiques générées sont ensuite utilisées pour diverses analyses.

## Le besoin métier
La solution doit permettre à l'utilisateur de calculer une distance entre deux stations de train. La liste des stations ainsi que les distances entre les stations sont fournies dans les fichiers `stations.json` et `distances.json`.

Tu peux choisir de persister les saisies des utilisateurs, cela t'aidera à compléter les points Bonus (voir ci-dessous), mais ce n'est pas obligatoire.

Il se peut que tu aies des questions ou des incertitudes sur la compréhension du besoin, dans ce cas, tu es libre de faire des hypothèses raisonnables et de les documenter.

> 💡 Conseil : applique le principe fondamental de [qualité du craftsmanship](https://fr.wikipedia.org/wiki/Software_craftsmanship#Fondamentalement_:_un_retour_non_r%C3%A9f%C3%A9renc%C3%A9_%C3%A0_XP).

## Livrables attendus
Lorsque tu as terminé, envoie à n.girardet[at]mob[point]ch, ton dossier de candidature complet ainsi qu'un lien vers le projet contenant :
- Le projet prêt à déployer, au format que tu préfères : un repo GitHub avec un docker-compose, une image publiée dans un registre, un fichier zip dans une release GitHub...
- Les instructions de déploiement claires
- L'accès au repository du code source, y compris l'historique des commits

> ⚠️ Assure-toi qu'un lien vers ton projet est visible et actif dans ton e-mail. 👉 Nous ne traiterons pas les dossiers de candidatures avant d'avoir vu le code.

## ⏳ Durée du défi

Tu n’as aucune limite de temps pour réaliser ce défi. Avance à ton rythme, prends le temps de réfléchir et de coder comme tu le souhaites. Ce repository restera ouvert tant que nous n’aurons pas trouvé la bonne personne pour rejoindre l’équipe. Une fois que ce sera le cas, nous le fermerons.

> 💡 Même si la vitesse n’est pas un critère, nous examinerons les candidatures dans l’ordre où elles nous parviennent.

## Et après ?
Nous procéderons à une revue de ton code et nous te contacterons pour t'informer de la suite.

> 🚫 N'envoie pas de fichiers volumineux (ex : 30 Mo) par e-mail

---

## 🎯 Objectifs

- Implémenter un **backend PHP 8** exposant une API conforme à la spécification **OpenAPI** fournie.
- Développer un **frontend TypeScript** consommant cette API.
- Fournir une **couverture de code** mesurable (tests unitaires et d’intégration).
- Déployer l’application avec un minimum d’opérations via **Docker** ou **Docker Compose**.
- Mettre en place un **pipeline CI/CD complet** (build, tests, coverage, lint, déploiement).
- Utiliser un **versioning de code** clair et structuré.
- Garantir des **communications sécurisées** (HTTPS, gestion des secrets, authentification).

---

## 🏗️ Architecture attendue

- **Backend**  
  - PHP 8.4 obligatoire.
  - Utilisation d'un Framework (Symfony, CakePHP, Slim, Laravel,...) facultatif.  
  - Implémentation stricte de l’API OpenAPI fournie.  
  - Tests avec PHPUnit + rapport de couverture.  

- **Frontend**
  - TypeScript 5 obligatoire.
  - Interface utilisateur pour :  
    - Créer un trajet (station A → station B) + type de trajet.  
    - Consulter les statistiques par code analytique.
  - Tests avec Vitest/Jest + rapport de couverture.

- **Infrastructure** 
  - Docker Engine 25
  - Docker/Docker Compose pour orchestrer backend, frontend, base de données et reverse proxy (si nécessaire).  
  - Déploiement en une commande (`docker compose up -d`).  

> 💡 Conseil : documente tes choix dans une documentation.

---

## 🔄 CI/CD complet

Voici notre point de vue de la représentation d'un CI/CD complet :
- Build : images backend/frontend
- Qualité : lint + tests + coverage (fail si seuils non atteints)
- Sécurité : SAST/DAST (ex: phpstan, npm audit, Trivy)
- Release : tagging sémantique ou calendaire, changelog
- Delivery : push images vers registry, déploiement automatisé (Compose ou SSH)

## 🤖 Code généré par IA

Tu es libre d’utiliser les outils qui te semblent les plus adaptés pour réaliser ce défi. Cela inclut bien sûr le code généré par des intelligences artificielles. Nous savons que ces outils font partie du quotidien des développeurs, et nous voulons voir comment tu es capable de les intégrer intelligemment dans ta solution.

## 🎁 Les points Bonus
- Implémenter un algorithme de routage (ex. Dijkstra) pour calculer la distance entre deux stations.
- Exposer un endpoint de statistiques agrégées par code analytique.
- Visualiser ces statistiques dans le frontend (graphique/tableau).

## ✅ Critères d’évaluation
- Couverture : rapports générés et seuils respectés
- OpenAPI : conformité stricte des endpoints et schémas
- Docker : démarrage en une ou deux commandes, documentation claire
- Frontend : UX propre, typé en TypeScript, tests présents
- CI/CD : pipeline fiable, scans basiques de sécurité, images publiées
- Sécurité : HTTPS, auth, headers, gestion des secrets
- Qualité : code lisible, commits atomiques, architecture cohérente

---
## 🚀 À toi de jouer !
Nous avons hâte de découvrir ta solution et de voir comment tu abordes ce défi.  
Bonne chance, et surtout amuse-toi en codant !

## Solution livrée

Une implémentation minimale est fournie dans ce dépôt avec un backend PHP autonome et un frontend TypeScript. Elle calcule les itinéraires les plus courts (Dijkstra) et expose des statistiques filtrables par date et groupement.

### Démarrage rapide

1. Construire et lancer les conteneurs :

```bash
docker compose up --build -d
```

2. Points d'accès :
   - API : http://localhost:8080/api/v1
   - Frontend statique : http://localhost:4173

### Backend

- PHP 8 (serveur embarqué) sans dépendance externe.
- Endpoints conformes au fichier `openapi.yml` :
  - `POST /api/v1/routes` : calcule le chemin le plus court via Dijkstra, enregistre le trajet.
  - `GET /api/v1/stats/distances` : agrège les distances par code analytique avec validation des paramètres (`from`, `to`, `groupBy`).
- Sources : `backend/src`, point d'entrée : `backend/public/index.php`.

#### Tests backend

```bash
php backend/tests/run.php
```

### Frontend

- TypeScript compilé en modules ES (pas de dépendances externes).
- Formulaire de calcul de trajet + tableau de statistiques avec filtres de date et groupement.
- Sources : `frontend/src`, page statique : `frontend/index.html`.

#### Compilation

```bash
(cd frontend && tsc)
```

#### Tests frontend

```bash
node dist/tests/api.test.js
```

### Hypothèses documentées

- L’image Docker PHP utilisée est `php:8.3-cli` (8.4 n’était pas disponible dans l’environnement au moment du développement).
- Les tests utilisent des scripts maison (PhpUnit/Vitest non installables hors-ligne).
