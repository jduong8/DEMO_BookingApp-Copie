const db = require("../db.js");
const Reservation = db.reservation;
const Place = db.place;
const USER_ROLE = require("../models/userRole.model.js");
const RESERVATION_STATUS = require("../models/reservationStatus.model.js");
const formatter = require("../helpers/dateTimeFormatter.js");

exports.findAll = async (req, res, next) => {
  try {
    let reservations;

    // Si l'utilisateur est un admin ou un super_admin: récupérer toutes les réservations
    if (
      req.user.user_role === USER_ROLE.ADMIN ||
      req.user.user_role === USER_ROLE.MASTER
    ) {
      reservations = await Reservation.findAll();
    } else {
      // Sinon, récupérer uniquement les réservations créées par l'utilisateur actuel
      reservations = await Reservation.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }
    // Formattage de reservation_date et reservation_time pour chaque réservation individuellement
    const formattedReservations = reservations.map((reservation) => {
      const reservationData = reservation.toJSON();

      reservationData.reservation_date = formatter.formatDate(
        reservationData.reservation_date,
      );
      reservationData.reservation_time = formatter.formatTime(
        reservationData.reservation_time,
      );

      return reservationData;
    });

    res.send(formattedReservations);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      number_of_customers,
      reservation_date,
      reservation_time,
      reservation_name,
      reservation_note,
    } = req.body;

    // Validation du format de la date et de l'heure
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(reservation_date) ||
      !/^\d{2}:\d{2}$/.test(reservation_time)
    ) {
      return res.status(422).json({
        error: "Invalid date or time format",
        date: "Valid format YYYY-MM-DD",
        time: "Valid format HH:MM",
      });
    }

    const newReservation = await Reservation.create({
      number_of_customers,
      reservation_date,
      reservation_time,
      reservation_name,
      reservation_note,
      reservation_status: RESERVATION_STATUS.PENDING,
      userId: req.user.id,
    });

    // Convertir l'objet de réservation en JSON pour la réponse
    const reservationResponse = newReservation.toJSON();
    reservationResponse.reservation_date = formatter.formatDate(
      reservationResponse.reservation_date,
    );
    reservationResponse.reservation_time = formatter.formatTime(
      reservationResponse.reservation_time,
    );

    res.send(reservationResponse);
  } catch (error) {
    console.error("Reservation creation error:", error);
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

  try {
    // Préparer l'objet de mise à jour
    const reservation = {
      number_of_customers: req.body.number_of_customers,
      reservation_date: req.body.reservation_date,
      reservation_time: req.body.reservation_time,
      reservation_name: req.body.reservation_name,
      reservation_note: req.body.reservation_note,
    };

    // Si l'utilisateur est un administrateur, permettre la mise à jour du statut
    if (req.user.user_role === "Admin") {
      reservation.reservation_status = req.body.reservation_status;
    } else if (reservation.userId !== req.user.id) {
      // Si l'utilisateur n'est ni l'auteur de la réservation ni un administrateur, refuser l'accès
      return res.status(403).send({
        error: "Your are not authorized to update this reservation",
      });
    }

    // Mettre à jour la réservation
    await Reservation.update(reservation, {
      where: {
        id: reservationId,
      },
    });

    res.status(200).send({
      message: `Reservation updated for reservationID: ${reservationId}`,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
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
  if (userRole !== USER_ROLE.ADMIN) {
    return res.status(403).send({
      message: "Your are not authorized to delete this reservation",
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

exports.confirmReservation = async (req, res, next) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only admins and masters can confirm reservations.",
        });
    }

    // Trouver une place disponible qui correspond au nombre de clients
    const place = await Place.findOne({
      where: {
        seats_count: reservation.number_of_customers,
        is_available: true,
      },
    });

    if (!place) {
      return res.status(404).json({
        message: `No available place found for ${reservation.number_of_customers} customers.`,
      });
    }

    // Met à jour la réservation avec l'ID de la place et confirme la réservation
    await reservation.update({
      placeId: place.id,
      reservation_status: RESERVATION_STATUS.CONFIRMED,
    });

    // Marque la place comme n'étant plus disponible
    await place.update({ is_available: false });

    res.status(200).json({
      message: `Reservation confirmed with place ${place.id} now reserved and not available.`,
      reservation: reservation,
      place: place,
    });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    next(error);
  }
};
