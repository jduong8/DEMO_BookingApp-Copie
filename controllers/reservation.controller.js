const db = require("../db.js");
const Reservation = db.reservation;
const ADMIN = "admin";
const SUPER_ADMIN = "super_admin";

exports.findAll = async (req, res, next) => {
  try {
    let reservations;

    // Si l'utilisateur est un admin ou un super_admin: récupérer toutes les réservations
    if (req.user.user_role === ADMIN || req.user.user_role === SUPER_ADMIN) {
      reservations = await Reservation.findAll();
    } else {
      // Sinon, récupérer uniquement les réservations créées par l'utilisateur actuel
      reservations = await Reservation.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }

    res.send(reservations);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    console.log("Req User:", req.user.id);
    const {
      number_of_customers,
      reservation_date,
      reservation_name,
      reservation_note,
    } = req.body;

    const validations = {
      number_of_customers: "number",
      reservation_date: "string",
      reservation_name: "string",
      reservation_note: "string",
    };

    for (const [key, type] of Object.entries(validations)) {
      if (typeof req.body[key] !== type) {
        return res.status(422).json({ error: `${key} must be a ${type}` });
      }
    }

    const reservation = await Reservation.create({
      number_of_customers: number_of_customers,
      reservation_date: reservation_date,
      reservation_name: reservation_name,
      reservation_note: reservation_note,
      reservation_status: 1,
      userId: req.user.id, // supposant que l'utilisateur actuel est stocké dans req.user
    });
    res.send(reservation);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const reservationId = req.params.id;

  // Trouver la réservation dans la base de données
  const reservation = await Reservation.findByPk(reservationId);

  // Si la réservation n'existe pas, renvoyer une erreur
  if (!reservation) {
    return res.status(404).send({
      error: `Reservation not found with id: ${reservationId}`,
    });
  }

  // Vérifier que l'utilisateur actuellement connecté est l'auteur de la réservation
  if (reservation.userId !== req.user.id) {
    return res.status(403).send({
      error: "User not authorized to update this reservation",
    });
  }

  try {
    // Mettre à jour la réservation
    await Reservation.update(
      {
        number_of_customers: req.body.number_of_customers,
        reservation_date: req.body.reservation_date,
        reservation_name: req.body.reservation_name,
        reservation_note: req.body.reservation_note,
        reservation_status: 1,
      },
      {
        where: {
          id: reservationId,
        },
      },
    );
    res
      .status(200)
      .send({
        message: `Reservation updated for reservationID: ${reservationId}`,
      });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const reservationId = req.params.id;

  // Trouver la réservation dans la base de données
  const reservation = await Reservation.findByPk(reservationId);

  // Si la réservation n'existe pas, on renvoie une erreur
  if (!reservation) {
    return res.status(404).send({
      message: `Reservation not found with id: ${reservationId}`,
    });
  }

  // Vérifier que l'utilisateur actuellement connecté est l'auteur de la réservation,
  // ou qu'il a le rôle d'admin ou de super_admin
  const userRole = req.user.user_role;
  if (
    reservation.userId !== req.user.id &&
    userRole !== ADMIN &&
    userRole !== SUPER_ADMIN
  ) {
    return res.status(403).send({
      message: "User not authorized to delete this reservation",
    });
  }
  try {
    // Supprimer la réservation
    Reservation.destroy({
      where: { id: reservationId },
    });
    res.status(200).send({
      message: `Reservation deleted for reservationID: ${reservationId}`,
    });
  } catch (error) {
    next(error);
  }
};
