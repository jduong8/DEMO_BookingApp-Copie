# Tâches Principales

### Vérifications :

- [x] Modèles créés (user, reservation, table, product, order)
- [x] Routes POST, GET, PUT, DELETE pour chaque entité
- [x] Seeds pour toutes les entités
- [x] Jest et super test implémentés
- [x] Authentification avec bcrypt et jwt (login/signup)

### À Finaliser :

- [x] ESLINT / Prettier (Commande : npm run lint)
- [x] Middleware d'admin (gestion des accès utilisateurs)
- [x] Rôles utilisateurs modifiables par les admins
- [x] Admins : accès complet aux users, réservations, tables, produits, commandes
- [x] Utilisateurs : modification de leurs données personnelles et visualisation de leurs réservations
- [x] Fonctionnalité de réinitialisation du mot de passe

### Développement en Cours :

- [x] Documentation du code et README (prérequis, installation, commandes essentielles)
- [x] Controllers pour les entités (logique métier séparée des routes)
- [x] Dossier /docs avec fichier doc.md (avancement, bugs, sources, captures d’écran)
- [x] Nouvelle fonctionnalité : Réservation de plats (nom, description, prix, catégorie, quantité)
- [x] Visibilité et réservation des plats par les utilisateurs

### Bonus

- [x] Relations entre tables (user -> reservation, réservation <--> table, table <--> order, order <--> product...)
- [x] Swagger pour documentation API
- [x] Commitizen et Husky pour gestion de Git
- [ ] Socket.io pour gestion en temps réel
- [x] Front-end HTML/CSS/JS avec fetch pour requêtes API

### Consignes Supplémentaires

- [x] Respecter les bonnes pratiques de développement.
- [x] Prioriser la clarté et l'efficacité du code.
- [x] Documenter toute avancée significative et difficultés rencontrées.
