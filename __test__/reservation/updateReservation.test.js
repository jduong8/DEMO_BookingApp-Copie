const request = require("supertest");
const app = require("../../app.js");
const Reservation = require("../../db.js").reservation;
const STATUS = require("../../models/reservationStatus.model.js");

describe("PUT /reservations/:id/info/update - Update Reservation", () => {
  let clientToken, adminToken, reservationId;

  beforeAll(async () => {
    let admin = await request(app).post("/api/signin").send({
      email: "superman@example.com",
      user_password: "clark12345678",
    });
    adminToken = admin.body.token;

    let client = await request(app).post("/api/signin").send({
      email: "alice@example.com",
      user_password: "alice12345678",
    });
    clientToken = client.body.token;

    // Créer une réservation de test
    const newReservation = await Reservation.create({
      number_of_customers: 4,
      reservation_date: new Date(),
      reservation_time: "19:00",
      reservation_name: "Test Reservation",
      reservation_note: "Test note",
      reservation_status: STATUS.PENDING,
    });
    reservationId = newReservation.id;
  });

  it("should allow an authorized user to update a reservation", async () => {
    const updatedData = {
      number_of_customers: 2,
      reservation_date: "2023-01-01",
      reservation_time: "20:00",
      reservation_name: "Updated Name",
      reservation_note: "Updated note",
    };

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${adminToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(2);
    expect(response.body.reservation.reservation_status).toBe(STATUS.PENDING);
  });

  it("should return a 404 error if the reservation does not exist", async () => {
    const nonExistentReservationId = 999999;
    const updatedData = { number_of_customers: 2 };

    const response = await request(app)
      .put(`/api/reservations/${nonExistentReservationId}/info/update`)
      .set("Authorization", `${clientToken}`)
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(`Reservation not found.`);
  });

  afterAll(async () => {
    // Nettoyer les données de test
    if (reservationId) {
      await Reservation.destroy({ where: { id: reservationId } });
    }
  });
});
