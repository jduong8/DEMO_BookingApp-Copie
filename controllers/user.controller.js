const USER_ROLE = require("../models/userRole.model.js");
const UserService = require("../services/user.service");
const RoleService = require("../services/role.service");
const userService = new UserService();
const roleService = new RoleService();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.user.role, req.user.id);
    res.send(users);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    // Sinon, on renvoie les informations de l'utilisateur (sans le mot de passe)
    res.status(200).json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const newRole = req.path.includes("/admin")
    ? USER_ROLE.ADMIN
    : USER_ROLE.CLIENT;

  try {
    await userService.getUserById(userId);

    const user = await roleService.updateRole(userId, newRole);
    // Renvoyer une réponse de succès
    res.status(200).json({
      message: `User role updated to ${newRole} successfully.`,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* PUT */
exports.updateUserInfo = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await userService.getUserById(userId);

    const updatedData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
    };

    const updatedUser = await userService.updateUserInfo(userId, updatedData);
    res.status(200).json({
      message: `User updated successfully`,
      user: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    await userService.updatePassword(req.user.id, oldPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* DELETE */
exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
