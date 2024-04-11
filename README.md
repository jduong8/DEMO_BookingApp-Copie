# Atelier de réservation de restaurant.

- [Voir brief](./documents//BRIEF.md)

- [Commment utiliser ce projet](./documents/SETUP.md)

## Description

Ce projet comporte la création d'un serveur NodeJS:

- Utilisation de Express.

- Utilisation d'une base de données PostgreSQL avec l'ORM Sequelize pour gérer les données.

- Mise en place du CRUD (Create, Read, Update, Delete) et des routes pour manipuler les données.

- Implémentation des Tests Unitaires.

- Mise en place d'une Architecture MVC (Modèle View Controller).

- Mise en place d'une matrice de test sous format Markdown.

- Mise en place d'une Documentation de l'API avec Swagger.

## Aperçu de l'arborescence

```markdown
.
├── **test**
│ ├── authentication
│ │ ├── signin.test.js
│ │ └── signup.test.js
│ ├── product
│ │ ├── addNewProduct.test.js
│ │ ├── deleteProduct.test.js
│ │ ├── getAllProducts.test.js
│ │ ├── getOneProduct.test.js
│ │ └── updateProduct.test.js
│ ├── reservation
│ │ ├── addReservation.test.js
│ │ ├── getReservations.test.js
│ │ └── updateReservation.test.js
│ ├── table
│ │ ├── addNewTable.test.js
│ │ └── getAllTables.test.js
│ └── user
│ ├── deleteUser.test.js
│ ├── getAllUsers.test.js
│ ├── getUserInfo.test.js
│ ├── updatePassword.test.js
│ ├── updateUserInfo.test.js
│ └── updateUserRole.test.js
├── config
│ └── config.js
├── controllers
│ ├── auth.controller.js
│ ├── order.controller.js
│ ├── product.controller.js
│ ├── reservation.controller.js
│ ├── table.controller.js
│ └── user.controller.js
├── helpers
│ └── dateTimeFormatter.js
├── middlewares
│ ├── checkAuthOrAdmins.middleware.js
│ ├── checkRole.middleware.js
│ ├── errorHandler.middleware.js
│ ├── jwt.middleware.js
│ └── morgan.middleware.js
├── models
│ ├── category.model.js
│ ├── index.js
│ ├── order.model.js
│ ├── product.model.js
│ ├── reservation.model.js
│ ├── reservationStatus.model.js
│ ├── table.model.js
│ ├── user.model.js
│ └── userRole.model.js
├── routes
│ ├── auth.routes.js
│ ├── index.js
│ ├── order.routes.js
│ ├── product.routes.js
│ ├── reservation.routes.js
│ ├── table.routes.js
│ └── user.routes.js
├── seeders
│ ├── 20240314101137-mock-users.js
│ ├── 20240314101150-mock-reservations.js
│ ├── 20240314101202-mock-products.js
│ └── 20240314101211-mock-tables.js
├── utils
│ └── logger.js
├── db.js
└── app.js
```

## Outils utilisé

- IDE: [Visual Studio Code](https://code.visualstudio.com/)
- Navigateurs: [Google Chrome](https://www.google.com/chrome/) & [Firefox](https://www.mozilla.org/en-US/firefox/new/)
- [TablePlus](https://tableplus.com/) pour la gestion de la base de données
- Terminal: [iTerm2](https://iterm2.com/) avec le framework [OhMyZSH](https://ohmyz.sh/) mais le terminal intégré dans l'IDE VScode est suffisant.
- [SourceTree](https://www.sourcetreeapp.com/)
- [Postman](https://www.postman.com/)
- [ESLint](https://eslint.org/docs/latest/use/getting-started)
- [Prettier](https://prettier.io/docs/en/install.html)

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
- [Forget password feature](https://dev.to/cyberwolves/how-to-implement-password-reset-via-email-in-node-js-132m)
- [Regex DateFormat](https://stackoverflow.com/questions/7388001/javascript-regex-to-validate-date-format)

## Screenshots

### Schéma du Modèle Physique de Données

![](assets/screen-MPD.png)

### SourceTree

![](assets/screen-sourceTree-01.png)
![](assets/screen-sourceTree-02.png)

### ESLint

![](assets/screen-eslint.png)
