# Étapes à suivre pour utiliser ce serveur.

1. Clonez le projet.
2. Ouvrir le projet avec un IDE (**VSCode** par exemple).
3. Ouvrir le terminal depuis l'**IDE**.
4. Entrez le ligne de commande suivante:

```bash
npm install
```

5. Assurez vous de bien connaître vos identifiants pour vous connecter à votre serveur local.

Voici les lignes de commandes à entrer dans le terminal:

```bash
psql postgres
```

Cette ligne vous sert à utiliser postgres

```bash
\l
```

Cette ligne vous sert à lister vos base de données

```bash
CREATE DATABASE le_nom_de_ta_nouvelle_db;
```

Cette ligne vous sert à lister vos base de données

6. Créez un fichier `.env` à la racine du projet

### Template du fichier `.env`

```javascript
SECRET_KEY=

TEST_DB_HOST=
TEST_DB_USER=
TEST_DB_PASSWORD=
TEST_DB_NAME=

DEV_DB_USER=
DEV_DB_PASSWORD=
DEV_DB_NAME=
DEV_DB_HOST=

PROD_DB_USER=
PROD_DB_PASSWORD=
PROD_DB_NAME=
PROD_DB_HOST=

// Pas nécessaire, sauf si vous souhaitez tester le service de Réinitialisation de Mot de passe
// Il faudra une addresse hotmail pour évitez de faire d'autres configuration
HOTMAIL_ADDRESS=
HOTMAIL_PASSWORD=
```

7. Ensuite entrez le ligne de commande suivante:

```bash
npm run start
```

8. Vous devriez avoir ce log dans le terminal.

![](assets/log-npm-start.png)
