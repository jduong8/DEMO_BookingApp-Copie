# Explication de concept

### Middlewares

Les middlewares dans Express.js sont des fonctions qui ont accès à l'objet de requête (req), l'objet de réponse (res) et à la fonction middleware suivante dans le cycle de requête-réponse de l'application. Ces fonctions peuvent exécuter du code, modifier les objets de requête et de réponse, terminer le cycle de requête-réponse ou appeler la fonction middleware suivante.

#### Exemple de code qui vérifie l'authentification

```javascript
const verifyJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ auth: false, message: "Token required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ auth: false, message: "Incorrect token." });
  }
};
```

#### Exemple de code qui utilise ce middleware

```javascript
router.get(
  "/reservations/all",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER, USER_ROLE.CLIENT]),
  reservationController.getAllReservations,
);
```

Pour faire simple, un middleware c'est la validation d'entrée avant de recevoir la liste des réservations pour cette exemple.

### Controllers

Les controllers sont des modules qui contiennent la logique pour gérer les requêtes HTTP pour différentes routes. Ils séparent la logique des routes de l'application, rendant le code plus organisé et maintenable. Les controllers définissent comment les requêtes spécifiques doivent être traitées.

#### Exemple de code d'un controller

```javascript
exports.getAllReservations = async (req, res, next) => {
  try {
    let reservations;
    const queryOptions =
      req.user.role === USER_ROLE.CLIENT
        ? { where: { userId: req.user.id } }
        : {};

    reservations = await Reservation.findAll(queryOptions);

    // Formattage de date et time pour chaque réservation
    const formattedReservations = reservations.map((reservation) => {
      const reservationData = reservation.toJSON();

      reservationData.date = formatter.formatDate(reservationData.date);
      reservationData.time = formatter.formatTime(reservationData.time);

      return reservationData;
    });

    res.send(formattedReservations);
  } catch (error) {
    next(error);
  }
};
```

### Service

C'est un autre niveau d'abstraction utilisé dans les applications pour organiser le code et séparer la logique métier des controllers.
C'est lui qui gère les opérations métiers.
Ça permet d'avoir un code plus propre et plus maintenable.
[Voir aussi principe SOLID](https://medium.com/@abderrahmane.roumane.ext/tout-comprendre-des-principes-solid-en-10-minutes-votre-guide-rapide-pour-un-code-plus-efficace-bc625c3634f5)

# Veille

### NodeJS

Node.js Best Practices [GitHub](https://github.com/goldbergyoni/nodebestpractices) : Ce dépôt GitHub est une compilation exhaustive des meilleures pratiques pour Node.js, couvrant des sujets comme la sécurité, les performances, la gestion de la production, et bien plus encore. C'est une très bonne ressource pour les développeurs qui cherchent à optimiser leurs applications Node.js​.

Authentification et Autorisation : On utilise des mécanismes comme JSON Web Tokens (JWT) ou OAuth 2.0 pour sécuriser les points d'accès API. On stockez les mots de passe des utilisateurs de manière sécurisée en utilisant des techniques de hachage et de salage, et implémentez un contrôle d'accès basé sur les rôles pour restreindre l'accès aux ressources en fonction des autorisations des utilisateurs​.[CloudDev](https://clouddevs.com/node/security-best-practices/)

Validation et assainissement des entrées utilisateurs : Otilisez des bibliothèques comme joi ou express-validator pour valider les entrées des utilisateurs et prévenir les injections de code malveillant. [Keenethics](https://keenethics.com/blog/nodejs-security).

### iOS

MacRumors, pour les nouvelles concernant les mises à jour iOS et les fonctionnalités à venir. Ils couvrent en détail les nouvelles fonctionnalités de chaque mise à jour, comme iOS 18 qui introduit de nouvelles options de personnalisation, des améliorations de Siri, et des fonctionnalités avancées de sécurité et de confidentialité.[MacRumors](https://www.macrumors.com/roundup/ios-18/)

Medium, Une communauté active de développeurs iOS qui publient régulièrement des articles et des tutoriels sur divers aspects du développement iOS. Les sujets incluent des conseils sur Swift, des stratégies de gestion de la mémoire, des techniques de conception d'interface utilisateur, et bien plus encore.
[Medium - iOS Developer](https://medium.com/tag/ios)

Eventuellement Linkdin, un réseau rempli de professionnel où l'on peut parfois voir de nouvelles techniques d'implémentations.
