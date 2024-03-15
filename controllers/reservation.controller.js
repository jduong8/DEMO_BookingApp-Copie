const db = require("../db.js");
const Reservation = db.reservation;
const Table = db.table;
const USER_ROLE = require("../models/userRole.model.js");
const RESERVATION_STATUS = require("../models/reservationStatus.model.js");
const formatter = require("../helpers/dateTimeFormatter.js");

exports.getAllReservations = async (req, res, next) => {
  try {
    let reservations;

    // Le middleware s'occupe déjà de vérifier si l'utilisateur est un admin ou un master.
    // Pour les administrateurs ou masters, on récupère toutes les réservations.
    // Pour les utilisateurs clients, on ne récupère que leurs réservations.
    const queryOptions =
      req.user.user_role === USER_ROLE.CLIENT
        ? { where: { userId: req.user.id } }
        : {};

    reservations = await Reservation.findAll(queryOptions);

    // Formattage de reservation_date et reservation_time pour chaque réservation
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

exports.createNewReservation = async (req, res, next) => {
  try {
    const {
      number_of_customers,
      reservation_date,
      reservation_time,
      reservation_name,
      reservation_note,
    } = req.body;

    // Vérification de la présence des champs obligatoires
    if (
      !number_of_customers ||
      !reservation_date ||
      !reservation_time ||
      !reservation_name
    ) {
      return res.status(400).json({
        error: "Missing required reservation details",
      });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reservation_date)) {
      return res.status(422).json({
        error: "Invalid date format",
      });
    }

    // Validate time format (HH:MM)
    if (
      !/^\d{2}:\d{2}$/.test(reservation_time) ||
      parseInt(reservation_time.split(":")[1], 10) >= 60
    ) {
      return res.status(422).json({
        error: "Invalid time format",
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

exports.updateReservation = async (req, res, next) => {
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

exports.deleteReservation = async (req, res, next) => {
  const reservationId = req.params.id;

  // Trouver la réservation dans la base de données
  const reservation = await Reservation.findByPk(reservationId);

  // Si la réservation n'existe pas, on renvoie une erreur
  if (!reservation) {
    return res.status(404).send({
      message: `Reservation not found with id: ${reservationId}`,
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
