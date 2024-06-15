const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");
const createReservationMock = require("../../mocks/reservations.mock.js");

describe("Reservation: PUT - Update Reservation", () => {
  let clientToken, anotherClientToken, adminToken, masterToken, reservationId;

  beforeAll(async () => {
    const clients = await createClientMock();
    const admins = await createAdminMock();
    const reservationMock = await createReservationMock();

    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clients);
    await db.User.bulkCreate(admins);
    const reservations = await db.Reservation.bulkCreate(reservationMock);

    let masterLogin = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      password: "master12345678",
    });
    masterToken = masterLogin.body.token;

    let admin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    adminToken = admin.body.token;

    let client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = client.body.token;

    let anotherClient = await request(app).post("/api/signin").send({
      email: "bob@gmail.com",
      password: "bob12345678",
    });
    anotherClientToken = anotherClient.body.token;

    reservationId = reservations[2].id;
  });

  it("should allow MASTER to update a reservation", async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${masterToken}`)
      .send({
        number_of_customers: 2,
        date: new Date(),
        time: "20:00",
        name: "Updated Name",
        description: "Updated note",
      });

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(2);
  });

  it("should allow ADMIN to update a reservation", async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${adminToken}`)
      .send({
        number_of_customers: 6,
        date: new Date(),
        time: "20:00",
        name: "Updated Name",
        description: "Updated note",
      });

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(6);
  });

  it("should allow Client to update his reservation", async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", `${clientToken}`)
      .send({
        number_of_customers: 5,
        date: new Date(),
        time: "20:00",
        name: "Updated Name",
        description: "Updated note",
      });

    expect(response.status).toBe(200);
    expect(response.body.reservation.number_of_customers).toBe(5);
  });

  it("should not allow a different client to update the reservation", async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservationId}/info/update`)
      .set("Authorization", anotherClientToken)
      .send({
        number_of_customers: 10,
        date: new Date(),
        time: "20:00",
        name: "Updated Name",
        description: "Updated note",
      });

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
});
