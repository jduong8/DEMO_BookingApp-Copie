const db = require("../db.js");
const Reservation = db.Reservation;
const TableService = require("./table.service");
const RESERVATION_STATUS = require("../models/reservationStatus.model.js");
const USER_ROLE = require("../models/userRole.model.js");
const formatter = require("../helpers/dateTimeFormatter.js");

class ReservationService {
  constructor() {
    this.tableService = new TableService();
  }

  async getAllReservations(userRole, userId) {
    const queryOptions =
      userRole === USER_ROLE.CLIENT ? { where: { userId } } : {};

    const reservations = await Reservation.findAll(queryOptions);
    if (!reservations) return [];
    return reservations.map((res) => {
      const reservationData = res.toJSON();
      reservationData.date = formatter.formatDate(reservationData.date);
      reservationData.time = formatter.formatTime(reservationData.time);
      return reservationData;
    });
  }

  async getReservationDetail(id, userId) {
    const reservation = await Reservation.findOne({ where: { id, userId } });
    if (!reservation) throw new Error("Reservation not found");

    return reservation;
  }

  async createNewReservation(body, userId) {
    const { number_of_customers, date, time, name, description } = body;

    // Vérification de la présence des champs obligatoires
    if (!number_of_customers || !date || !time || !name)
      throw new Error("Missing required reservation details");

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error("Invalid date format");

    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(time) || parseInt(time.split(":")[1], 10) >= 60)
      throw new Error("Invalid time format");

    const newReservation = await Reservation.create({
      number_of_customers,
      date,
      time,
      name,
      description,
      status: RESERVATION_STATUS.PENDING,
      userId,
    });
    return newReservation;
  }

  async updateReservation(id, body) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      throw new Error("Reservation not found.");
    }
    const updatedReservation = await reservation.update(body);
    return updatedReservation;
  }

  async deleteReservation(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      throw new Error("Reservation not found.");
    }
    await reservation.destroy();
  }

  async confirmReservation(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    const table = await this.tableService.findAvailableTable(
      reservation.number_of_customers,
    );
    if (!table) {
      throw new Error("No available table found.");
    }

    await reservation.update({
      tableId: table.id,
      status: RESERVATION_STATUS.CONFIRMED,
    });

    await this.tableService.markTableAsUnavailable(table.id);

    return { reservation, table };
  }
}

module.exports = ReservationService;
