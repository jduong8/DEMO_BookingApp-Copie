const ReservationService = require("../services/reservation.service");
const reservationService = new ReservationService();

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations(
      req.user.role,
      req.user.id,
    );
    res.send(reservations);
  } catch {
    res.status(403).json({ message: "Access denied" });
  }
};

exports.getReservationDetail = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationDetail(
      req.params.id,
      req.user.id,
    );
    res.send(reservation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createNewReservation = async (req, res) => {
  try {
    const reservation = await reservationService.createNewReservation(
      req.body,
      req.user.id,
    );
    res.status(201).send(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const updatedReservation = await reservationService.updateReservation(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      message: "Reservation updated successfully.",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    res.status(200).send({ message: "Reservation deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.confirmReservation = async (req, res, next) => {
  try {
    const { reservation, table } = await reservationService.confirmReservation(
      req.params.id,
    );
    res.status(200).json({
      message: "Reservation confirmed successfully.",
      reservation,
      table,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
