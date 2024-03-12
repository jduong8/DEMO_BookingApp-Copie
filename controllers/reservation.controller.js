const db = require("../db.js");
const Reservation = db.reservation;
const Table = db.table;
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
  const {
    number_of_customers,
    reservation_date,
    reservation_time,
    reservation_name,
    reservation_note,
  } = req.body;

  try {
    // Recherche de la réservation dans la base de données
    const reservation = await Reservation.findByPk(reservationId);

    // Si la réservation n'existe pas, on renvoie une erreur
    if (!reservation) {
      return res
        .status(404)
        .json({ message: `Reservation not found with id: ${reservationId}` });
    }

    // Vérifie si le nombre de personnes a changé pour une réservation confirmée
    if (
      reservation.reservation_status === RESERVATION_STATUS.CONFIRMED &&
      reservation.number_of_customers !== number_of_customers
    ) {
      reservation.reservation_status = RESERVATION_STATUS.PENDING;
    }

    // Mettre à jour la réservation
    await reservation.update({
      number_of_customers,
      reservation_date,
      reservation_time,
      reservation_name,
      reservation_note,
      reservation_status: reservation.reservation_status,
    });

    res.status(200).json({
      message: `Reservation updated for reservationID: ${reservationId}`,
      reservation,
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
      return res.status(403).json({
        message:
          "Access denied. Only admins and masters can confirm reservations.",
      });
    }

    // Trouver une table disponible qui correspond au nombre de clients
    const getOneTable = await Table.findOne({
      where: {
        seats_count: reservation.number_of_customers,
        is_available: true,
      },
    });

    if (!getOneTable) {
      return res.status(404).json({
        message: `No available table found for ${reservation.number_of_customers} customers.`,
      });
    }

    // Met à jour la réservation avec l'ID de la table et confirme la réservation
    await reservation.update({
      tableId: getOneTable.id,
      reservation_status: RESERVATION_STATUS.CONFIRMED,
    });

    // Marque la table comme n'étant plus disponible
    await getOneTable.update({ is_available: false });

    res.status(200).json({
      message: `Reservation confirmed for ${reservation.number_of_customers} customers. Table ${getOneTable.id} now reserved`,
      reservation: reservation,
      table: getOneTable,
    });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    next(error);
  }
};
