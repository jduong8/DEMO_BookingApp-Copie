const db = require("../db.js");
const Table = db.table;
const USER_ROLE = require("../models/userRole.model.js");

exports.findAll = async (req, res, next) => {
  try {
    const tables = await Table.findAll();
    res.send(tables);
  } catch (error) {
    next(error);
  }
};

exports.addNewTable = async (req, res, next) => {
  const { seats_count } = req.body;
  try {
    // Vérifie si l'utilisateur a le rôle nécessaire pour créer une table
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only administrators can create tables.",
      });
    }

    // Vérifie que seats_count est un nombre et est positif
    if (!Number.isInteger(seats_count) || seats_count <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid seats_count. Must be a positive integer." });
    }

    // Création de Table en mettant par défaut la disponibilité à true
    const newTable = await Table.create({
      seats_count,
      is_available: true,
      has_seated_guests: false,
    });

    const tableResponse = newTable.toJSON();
    res.send(tableResponse);
  } catch (error) {
    console.error("Table creation error:", error);
    next(error);
  }
};

exports.updateSeatsCount = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant de la table depuis les paramètres de la requête
  const { seats_count } = req.body;

  try {
    // Vérification des rôles utilisateur
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins and masters can update tables.",
      });
    }

    // Recherche de la table à mettre à jour
    const table = await Table.findByPk(id);

    // Si la table n'existe pas, renvoie une erreur 404
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    // Vérifie que seats_count est un nombre et est positif si fourni
    if (
      seats_count !== undefined &&
      (!Number.isInteger(seats_count) || seats_count <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid seats_count. Must be a positive integer." });
    }

    // Mise à jour de la table
    await table.update({
      seats_count: seats_count !== undefined ? seats_count : table.seats_count,
    });

    // Réponse avec les détails de la table mise à jour
    res.status(200).json({
      message: "Table updated successfully.",
      table,
    });
  } catch (error) {
    console.error("Table update error:", error);
    next(error);
  }
};

exports.updateSeatedGuestsStatus = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant de la table depuis les paramètres de la requête

  try {
    // Vérification des rôles utilisateur
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message:
          "Access denied. Only admins and masters can update table status.",
      });
    }

    // Recherche de la table à mettre à jour
    const table = await Table.findByPk(id);

    // Si la table n'existe pas, renvoie une erreur 404
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    // Mise à jour de la table pour indiquer qu'elle a des invités assis
    await table.update({
      is_available: false,
      has_seated_guests: true,
    });

    // Réponse avec les détails de la table mise à jour
    res.status(200).json({
      message: "Table status updated successfully.",
      table,
    });
  } catch (error) {
    console.error("Table status update error:", error);
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant de la table depuis les paramètres de la requête

  try {
    // Vérification si l'utilisateur a le rôle d'administrateur
    if (req.user.user_role === USER_ROLE.CLIENT) {
      return res.status(403).json({
        message: "Access denied. Only admins can delete tables.",
      });
    }

    // Recherche de la table à supprimer
    const table = await Table.findByPk(id);

    // Si la Table n'existe pas, renvoyer une erreur 404
    if (!table) {
      return res.status(404).json({
        message: "Table not found.",
      });
    }

    // Suppression de la Table
    await table.destroy();

    // Réponse indiquant que la suppression a été réalisée avec succès
    res.status(200).json({
      message: "Table deleted successfully.",
    });
  } catch (error) {
    console.error("Table deletion error:", error);
    next(error);
  }
};
