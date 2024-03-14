const db = require("../db.js");
const Table = db.table;

exports.getAllTables = async (req, res, next) => {
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

exports.deleteTable = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant de la table depuis les paramètres de la requête

  try {
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
