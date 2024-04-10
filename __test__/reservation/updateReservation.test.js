const request = require("supertest");
const app = require("../../app.js");
const Reservation = require("../../db.js").reservation;
const STATUS = require("../../models/reservationStatus.model.js");
const winston = require("winston");

describe("PUT /reservations/:id/info/update - Update Reservation", () => {
  let clientToken, anotherClientToken, adminToken, masterToken, reservationId;

  beforeAll(async () => {
    let masterLogin = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      user_password: "master12345678",
    });
    masterToken = masterLogin.body.token;

    let admin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      user_password: "clark12345678",
    });
    adminToken = admin.body.token;

    let client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      user_password: "alice12345678",
    });
    clientToken = client.body.token;

    let anotherClient = await request(app).post("/api/signin").send({
      email: "bob@gmail.com",
      user_password: "bob12345678",
    });
    anotherClientToken = anotherClient.body.token;

    // Créer une réservation de test

    let mockReservation = await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${clientToken}`)
      .send({
        number_of_customers: 15,
        reservation_date: "2023-10-09",
        reservation_time: "12:30",
        reservation_name: "Mock",
        reservation_note: "Vue sur la mer",
      });
    reservationId = mockReservation.body.id;
  });

  it("should allow MASTER to update a reservation", async () => {
    const updatedData = {
      number_of_customers: 2,
      reservation_date: new Date(),
      reservation_time: "20:00",
      reservation_name: "Updated Name",
      reservation_note: "Updated note",
    };

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${masterToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(2);
    expect(response.body.reservation.reservation_status).toBe(STATUS.PENDING);
  });

  it("should allow ADMIN to update a reservation", async () => {
    const updatedData = {
      number_of_customers: 6,
      reservation_date: new Date(),
      reservation_time: "20:00",
      reservation_name: "Updated Name",
      reservation_note: "Updated note",
    };

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${adminToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(6);
    expect(response.body.reservation.reservation_status).toBe(STATUS.PENDING);
  });

  it("should allow Client to update his reservation", async () => {
    const updatedData = {
      number_of_customers: 5,
      reservation_date: new Date(),
      reservation_time: "20:00",
      reservation_name: "Updated Name",
      reservation_note: "Updated note",
    };

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${clientToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(5);
    expect(response.body.reservation.reservation_status).toBe(STATUS.PENDING);
  });

  it("should not allow a different client to update the reservation", async () => {
    const updatedData = {
      number_of_customers: 10,
      reservation_date: new Date(),
      reservation_time: "20:00",
      reservation_name: "Updated Name",
      reservation_note: "Updated note",
    };

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", anotherClientToken)
      .send(updatedData);

    expect(response.status).toBe(403);
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
