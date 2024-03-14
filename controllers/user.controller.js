require("dotenv").config();
const { Op } = require("sequelize");
const db = require("../db.js");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const USER_ROLE = require("../models/userRole.model.js");

/* GET */
exports.getAllUsers = (req, res) => {
  let whereCondition = {};

  // Liste des attributs à exclure dans la réponse
  const attributesToExclude = ["user_password"];

  // Un client n'est pas autorisé à récupérer la liste de tous les utilisateurs
  switch (req.user.user_role) {
    case USER_ROLE.ADMIN:
      whereCondition.user_role = USER_ROLE.CLIENT;
      break;
    case USER_ROLE.MASTER:
      whereCondition.user_role = {
        [Op.in]: [USER_ROLE.ADMIN, USER_ROLE.CLIENT],
      };
      whereCondition.id = { [Op.ne]: req.user.id }; // On exclue le Super Admin lui même
      break;
    case USER_ROLE.CLIENT:
      return res.status(403).json({ message: "Access denied" });
    default:
      return res.status(403).json({ message: "Invalid user role" });
  }

  User.findAll({
    where: whereCondition,
    attributes: { exclude: attributesToExclude },
  })
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.getUserInfo = async (req, res, next) => {
  try {
    // Récupérer l'ID utilisateur du token JWT
    const userId = req.user.id;

    // Trouver l'utilisateur dans la base de données à l'aide de l'ID
    const user = await User.findByPk(userId);

    // Si l'utilisateur n'existe pas, on renvoie une erreur 404
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sinon, on renvoie les informations de l'utilisateur (sans le mot de passe)
    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      user_role: user.user_role,
    });
  } catch (error) {
    next(error);
  }
};

/* POST */
exports.addSuperAdmin = async (req, res) => {
  try {
    // Valider les données reçues
    const { firstname, lastname, email, phone, user_password } = req.body;
    if (!firstname || !lastname || !email || !phone || !user_password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    // Création du super_admin
    const superAdmin = await User.create({
      user_role: USER_ROLE.MASTER,
      firstname,
      lastname,
      email,
      phone,
      user_password: hashedPassword,
    });

    // Générer un token JWT
    const payload = {
      id: superAdmin.id,
      email: superAdmin.email,
      user_role: superAdmin.user_role,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 60 * 60 * 24 });

    // Renvoyer le super_admin créé (sans le mot de passe) et le token
    res.status(200).json({
      message: "Super Admin créé",
      user: {
        id: superAdmin.id,
        firstname: superAdmin.firstname,
        lastname: superAdmin.lastname,
        email: superAdmin.email,
        phone: superAdmin.phone,
        user_role: superAdmin.user_role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création du superAdmin" });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const newRole = req.path.includes("/admin")
    ? USER_ROLE.ADMIN
    : USER_ROLE.CLIENT;

  try {
    // Recherche de l'utilisateur à mettre à jour
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Mise à jour du rôle de l'utilisateur
    await user.update({ user_role: newRole });

    // Renvoyer une réponse de succès
    res.status(200).json({
      message: `User role updated to ${newRole} successfully.`,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        user_role: user.user_role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

/* PUT */
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const currentUser = req.user;

    // Vérifier si currentUser est défini
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    if (currentUser.id !== userToUpdate.id) {
      return res
        .status(403)
        .json({ message: "Cannot update: Permission denied" });
    }

    const updatedData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
    };

    await User.update(updatedData, {
      where: {
        id: userId,
      },
    });

    res.status(200).send({
      message: `User updated for userId: ${userId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating user",
      details: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    // On va rechercher l'utilisateur dans la base de données
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // On récupère l'ancien mot de passe et le nouveau mot de passe du corps de la requête
    const { oldPassword, newPassword } = req.body;

    // On vérifie si l'ancien mot de passe fourni est correct
    const validPassword = await bcrypt.compare(oldPassword, user.user_password);
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // On vérifie si le nouveau mot de passe est valide (non vide, longueur suffisante, etc.)
    if (!newPassword || newPassword.trim().length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    // Hashage du nouveau mot de passe et mettre à jour dans la base de données
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.user_password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};

/* DELETE */
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  User.destroy({
    where: {
      id: userId,
    },
  }).then(() => {
    res.status(200).send({
      message: `User deleted for userId: ${userId}`,
    });
  });
};
