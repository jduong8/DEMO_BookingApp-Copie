# Tâches Principales

### Vérifications :

- [x] Modèles créés (rooms, user, spot, réservation)
- [x] Routes POST, GET, PUT, DELETE pour chaque entité
- [x] Seeds pour toutes les entités
- [x] Jest et super test implémentés
- [x] Authentification avec bcrypt et jwt (login/signup)

### À Finaliser :

- [x] ESLINT / Prettier (Commande : npm run lint)
- [x] Middleware d'admin (gestion des accès utilisateurs)
- [x] Rôles utilisateurs modifiables par les admins
- [x] Admins : accès complet aux spots, rooms, users, réservations
- [x] Utilisateurs : modification de leurs données personnelles et visualisation de leurs réservations
- [x] Fonctionnalité de réinitialisation du mot de passe

### Développement en Cours :

- [x] Documentation du code et README (prérequis, installation, commandes essentielles)
- [x] Controllers pour les entités (logique métier séparée des routes)
- [x] Dossier /docs avec fichier doc.md (avancement, bugs, sources, captures d’écran)
- [ ] Nouvelle fonctionnalité : Réservation de plats (nom, description, prix, catégorie, quantité)
- [ ] Visibilité et réservation des plats par les utilisateurs

### Bonus

- [ ] Relations entre tables (User ↔ réservation, réservation ↔ spot, spot ↔ réservation)
- [ ] Swagger pour documentation API
- [ ] Commitizen et Husky pour gestion de Git
- [ ] Socket.io pour gestion en temps réel
- [ ] Front-end HTML/CSS/JS avec fetch pour requêtes API

### Consignes Supplémentaires

- [x] Respecter les bonnes pratiques de développement.
- [x] Prioriser la clarté et l'efficacité du code.
- [x] Documenter toute avancée significative et difficultés rencontrées.

## Description / Explications

Dans cette version, les models `Room`, `Spot`, `User`, `Reservation` ont bien été mis en place.
Par contre, concernant les controllers, il y a uniquement pour la partie `User` et `Reservation`.

La partie où j'ai passé le plus de temps est celle sur les **units tests**.

La fonctionnalité pour la réservation des plats n'est pas implémentée.

En sommes, une bonne partie des features sont en place telles que:
**Service reservation:**

- Affichage de la liste de toutes les réservations (Admin),
- Affichage de la liste de ses propres réservations (Client),
- Suppression d'une réservation (Admin)
- Ajout d'une réservation (Connexion requise),
- Modification de la réservation (Auteur uniquement),
- Modification du status de la réservation (Admin).

**Service user/authentification:**

- Création d'un utilisateur (Client par défaut),
- Création d'un super admin (Master dans mon cas),
- Modification du `role` d'un utilisateur (Master),
- Affichage de la liste des utilisateurs ['Admin', 'Client'] (Master),
- Affichage de la liste des utilisateurs ['Client'] (Admin),
- Affiche du détail de l'utilisateur (Auteur),
- Modification du mot de passe (Auteur),
- Suppression du compte (Auteur, Admin, Master)

Fonctionnalité incomplète:

- **Mot de passe oublié.**

Dans l'état actuel, je peux seulement envoyer une requête pour le mot de passe oublié: un mail sera envoyé à l'adresse concernée avec une URL (non configurer).

## Ressources

[Voir mes ressources](https://github.com/jduong8/DEMO_BookingApp-Copie/blob/main/README.md#ressources)

## Screenshot

**ESLint**

![Screenshot-ESLINT-results](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/04cbff90-075c-4781-8dbd-3de00c5656a8)

**TablePlus**

![Screenshot-seeders-tablePlus](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/257900b2-4659-40d2-853b-89d511d38cb3)

**package.json**

![Capture d’écran 2024-01-19 à 17 25 22](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/76adbd6d-80c0-4537-8a1e-801b20b323e5)

**Date Formatter**

![Capture d’écran 2024-01-19 à 17 27 44](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/99bc94a5-7446-4c56-8219-088474ebe868)

**SourceTree**

![Capture d’écran 2024-01-19 à 17 38 33](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/dc9ecf34-0944-4944-8a84-aca6aaf6e3c6)

![Capture d’écran 2024-01-19 à 17 38 54](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/87a0c364-b964-4228-a523-b9c391d2a072)

**Postman**

![Capture d’écran 2024-01-19 à 17 33 53](https://github.com/jduong8/DEMO_BookingApp-Copie/assets/67645352/b2f3e236-8ace-4325-84c4-e13d1364c693)
