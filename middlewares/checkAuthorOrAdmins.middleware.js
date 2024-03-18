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

      // Autoriser le MASTER à effectuer n'importe quelle action.
      if (currentUser.user_role === USER_ROLE.MASTER) {
        return next();
      }

      // Autoriser l'ADMIN à se gérer lui-même ou à gérer les CLIENTs uniquement.
      if (currentUser.user_role === USER_ROLE.ADMIN) {
        if (
          currentUser.id === resourceId ||
          resource.user_role === USER_ROLE.CLIENT
        ) {
          return next();
        } else {
          return res.status(403).json({ message: "Permission denied." });
        }
      }

      // Autoriser le CLIENT à se gérer lui-même uniquement.
      if (
        currentUser.user_role === USER_ROLE.CLIENT &&
        currentUser.id === resourceId
      ) {
        return next();
      }

      // Si aucune des conditions ci-dessus n'est remplie, l'accès est refusé.
      return res.status(403).json({ message: "Permission denied." });
    } catch (error) {
      console.error("Middleware error:", error);
      res
        .status(500)
        .json({ message: "Error checking authorship or admin rights" });
    }
  };

module.exports = checkAuthorOrAdminMiddleware;
