# Atelier de réservation de restaurant.

### Modèle Physique de données (Screenshot)

![Capture d’écran 2023-10-30 à 01 05 07](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/cce0a88f-7321-456a-af27-143073d0ebf6)

## Description

Ce projet comporte la création d'un serveur NodeJS:

- Utilisation de Express.

- Utilisation d'une base de données PostgreSQL avec l'ORM Sequelize pour gérer les données.

- Mise en place du CRUD (Create, Read, Update, Delete) et des routes pour manipuler les données.

- Implémentation des Tests Unitaires.

- Mise en place d'une Architecture MVC (Modèle View Controller)

## Aperçu de l'arborescence

```markdown
.
├── **test**
│ └── reservationController.test.js
│ └── userController.test.js
├── controllers
│ └── reservation.controller.js
│ └── user.controller.js
├── models
│ └── reservation.model.js
│ └── user.model.js
│ └── room.model.js
│ └── spot.model.js
├── routes
│ └── index.js
│ └── reservations.routes.js
│ └── users.routes.js
├── package.json
└── app.js
```

## Outils utilisé

- IDE: [Visual Studio Code](https://code.visualstudio.com/)
- Navigateurs: [Google Chrome](https://www.google.com/chrome/) & [Firefox](https://www.mozilla.org/en-US/firefox/new/)
- [TablePlus](https://tableplus.com/) pour la gestion de la base de données
- Terminal: [iTerm2](https://iterm2.com/) avec le framework [OhMyZSH](https://ohmyz.sh/) mais le terminal intégré dans l'IDE VScode est suffisant.
- [SourceTree](https://www.sourcetreeapp.com/)
- [Postman](https://www.postman.com/)

## Lignes de commande utilisés dans le Terminal

##### Installation des outils nécessaire

| Commande                                 | Explication                                                  |
| ---------------------------------------- | ------------------------------------------------------------ |
| `brew install --cask visual-studio-code` | Installe Visual Studio Code en utilisant Homebrew sur macOS. |
| `brew install postgresql@15`             | Installe PostgreSQL version 15 via Homebrew sur macOS.       |
| `brew install --cask tableplus`          | Installe TablePlus.                                          |

##### Installation des dépendances

| Commande                              | Explication                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `npx express nom_du_projet --no-view` | Pour générer un nouveau projet Express.js sans inclure le moteur de vue.      |
| `npm install sequelize`               | Installe Sequelize, un ORM pour Node.js.                                      |
| `npm install pg pg-hstore`            | Installe les dépendances nécessaires pour utiliser PostgreSQL avec Sequelize. |
| `npm install -g sequelize-cli`        | Installe globalement le CLI de Sequelize.                                     |
| `sequelize init`                      | Initialise un nouveau projet Sequelize.                                       |
| `npx sequelize-cli init`              | Alternative à `sequelize init` si le CLI n'est pas installé globalement.      |
| `npm install jsonwebtoken`            | Installe `jsonwebtoken` pour gérer l'authentification via JWT.                |
| `npm install bcrypt`                  | Installe `bcrypt` pour le hachage de mots de passe.                           |
| `npm install --save-dev jest`         | Installe Jest comme dépendance de développement pour les tests.               |
| `npm install --save-dev supertest`    | Installe `supertest` pour effectuer des tests HTTP.                           |
| `npm install dotenv`                  | Installe `dotenv` pour la gestion des variables d'environnement.              |

##### Lignes de commandes supplémentaire

| Commande                                    | Explication                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `psql -U username -h 127.0.0.1 -d postgres` | Se connecte à la base de données PostgreSQL en tant qu'utilisateur spécifié.                             |
| `node nom_du_fichier`                       | Exécute un fichier JavaScript avec Node.js.                                                              |
| `npm run test`                              | Exécute les tests définis dans votre projet, en général avec Jest.                                       |
| `npm run start`                             | Exécute le script "start" défini dans votre fichier `package.json`, souvent pour démarrer votre serveur. |

## Ressources

- [HomeBrew](https://brew.sh/)
- [MVC](https://blog.javascripttoday.com/blog/model-view-controller-architecture/)
- [Expressjs.com](https://expressjs.com/)
- [Markdown CheatSheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links)
- [pg-hstore](https://www.postgresql.org/docs/9.3/hstore.html)
- [Using PostgreSQL and Sequelize to persist our data](https://medium.com/@haybams/using-postgresql-and-sequelize-to-persist-our-data-c86854a3c6ac)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Screenshot POSTMAN

![Capture d’écran 2023-10-30 à 02 52 42](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/763f45d1-ce2a-431f-a7e9-b1d663940ce6)
