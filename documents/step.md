# Démarche de travail

Dans le cadre de cet ECF: Reservation d'un restaurant.

1 - Restitution du contexte.

2 - Réalisation de schéma (MERISE/UML) pour garantir une meilleur compréhension de system.

3 - Place au développement du serveur.

4 - Commencer par initialiser le serveur en utilisant [express](https://expressjs.com/) que je trouve très efficace pour créer des application WEP et des API.
Il simplifie le processus de développement en fournissant une série d'outils et de fonctionnalités robustes.

5 - On installe les dépendances nécessaire pour le développement telles que:

- sequelize --> [medium](https://medium.com/@haybams/using-postgresql-and-sequelize-to-persist-our-data-c86854a3c6ac) ou [https://sequelize.org/]()
- [pg et pg-hstore](https://www.postgresql.org/docs/9.3/hstore.html)
  pg -> Pour gérer la connexion avec PostgreSQL
  pg hstore -> Pour la sérialisarion et désérialisation des données json en un format hstore.
- bcrypt et jsonwebtoken concernant la sécurité pour la partie authentification.
- jest et supertest pour les testes unitaires et d'intégration

6 - Créer un repository git.

7 - Lié le projet au repo.

8 - Création d'une nouvelle branch pour modèles et relations

9 - On créer les modèles conforme au schéma relation effectué au préalable.

10 - Eventuellement, si présent, on implémente les relations entre les tables.

11 - Commit pour l'implémentation des modèles et leurs relations (si présente).

12 - git push et on merge sur develop (si git flow)

13 - Nouvelle branch pour le module authentification (à partir de develop)

14 - Implémentation du service + commit

15 - Implémentation du controller + commit

16 - Implémentation des routes + commit

17 - Implémentation des testes unitaires + commit

18 - Push + merge.

19 - Répété de 13 à 18.
