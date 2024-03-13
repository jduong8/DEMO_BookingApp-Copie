const USER_ROLE = require("../models/userRole.model.js");

const checkAuthorOrAdminMiddleware = (model) => async (req, res, next) => {
  const resourceId = req.params.id;
  const currentUser = req.user;

  try {
    const resource = await model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Vérifie si l'utilisateur est l'auteur ou un administrateur
    if (
      currentUser.id !== resource.userId &&
      currentUser.user_role !== USER_ROLE.ADMIN &&
      currentUser.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({ message: "Permission denied." });
    }

    // On assigne la ressource à l'objet de requête
    req.resource = resource;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res
      .status(500)
      .json({ message: "Error checking authorship or admin rights" });
  }
};

module.exports = checkAuthorOrAdminMiddleware;
