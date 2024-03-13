const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.user_role)) {
    return res.status(403).json({
      message: "Access denied.",
    });
  }
  next();
};

module.exports = checkRole;
