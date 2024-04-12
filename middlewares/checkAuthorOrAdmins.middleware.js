const USER_ROLE = require("../models/userRole.model.js");

const checkAuthorOrAdminMiddleware =
  (model, modelName) => async (req, res, next) => {
    const resourceId = parseInt(req.params.id, 10);
    const currentUser = req.user;

    try {
      const resource = await model.findByPk(resourceId);
      if (!resource) {
        return res.status(404).json({ message: `${modelName} not found.` });
      }

      // Determiner l'ID de l'utilisateur associé à la ressource.
      // Pour le modèle User, l'ID de l'utilisateur est directement `id`.
      // Pour les autres modèles, l'ID de l'utilisateur est dans `userId`.
      const associatedUserId =
        modelName === "User" ? resource.id : resource.userId;

      // Autoriser le MASTER à effectuer n'importe quelle action.
      if (currentUser.role === USER_ROLE.MASTER) {
        return next();
      }

      // Autoriser l'ADMIN à se gérer lui-même ou à gérer les CLIENTs uniquement,
      // mais pas les autres ADMINs ou le MASTER.
      if (currentUser.role === USER_ROLE.ADMIN) {
        if (resource.role === USER_ROLE.MASTER) {
          return res.status(403).json({
            message: "ADMIN - Permission denied for managing MASTER.",
          });
        }
        if (
          resource.role === USER_ROLE.ADMIN &&
          currentUser.id !== associatedUserId
        ) {
          return res.status(403).json({
            message: "ADMIN - Permission denied for managing other ADMIN.",
          });
        }
        return next();
      }

      // Autoriser le CLIENT à se gérer lui-même uniquement.
      if (
        currentUser.role === USER_ROLE.CLIENT &&
        currentUser.id === associatedUserId
      ) {
        return next();
      }

      // Dans tous les autres cas, refuser l'accès.
      return res.status(403).json({ message: "Permission denied." });
    } catch (error) {
      console.error("Middleware error:", error);
      res
        .status(500)
        .json({ message: "Error checking authorship or admin rights" });
    }
  };

module.exports = checkAuthorOrAdminMiddleware;
