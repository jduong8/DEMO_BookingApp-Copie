const db = require("../db.js");
const Place = db.place;
const USER_ROLE = require("../models/userRole.model.js");

exports.findAll = async (req, res, next) => {
  try {
    const places = await Place.findAll();
    res.send(places);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { seats_count } = req.body;
  try {
    // Vérifie si l'utilisateur a le rôle nécessaire pour créer un lieu
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins and masters can create places.",
      });
    }

    // Vérifie que seats_count est un nombre et est positif
    if (!Number.isInteger(seats_count) || seats_count <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid seats_count. Must be a positive integer." });
    }

    // Création de Place en mettant par défaut la disponibilité à true
    const newPlace = await Place.create({
      seats_count,
      is_available: true,
    });

    const placeResponse = newPlace.toJSON();
    res.send(placeResponse);
  } catch (error) {
    console.error("Place creation error:", error);
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant de la place depuis les paramètres de la requête

  try {
    // Vérification si l'utilisateur a le rôle d'administrateur
    if (req.user.user_role === USER_ROLE.CLIENT) {
      return res.status(403).json({
        message: "Access denied. Only admins can delete places.",
      });
    }

    // Recherche du lieu à supprimer
    const place = await Place.findByPk(id);

    // Si la place n'existe pas, renvoyer une erreur 404
    if (!place) {
      return res.status(404).json({
        message: "Place not found.",
      });
    }

    // Suppression de la place
    await place.destroy();

    // Réponse indiquant que la suppression a été réalisée avec succès
    res.status(200).json({
      message: "Place deleted successfully.",
    });
  } catch (error) {
    console.error("Place deletion error:", error);
    next(error);
  }
};
