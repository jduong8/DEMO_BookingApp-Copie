const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const { createClientMock } = require("../../mocks/users.mock.js");

describe("Reservation: POST - Add new reservation", () => {
  let token;

  beforeAll(async () => {
    const clients = await createClientMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clients);

    const user = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    token = user.body.token;
  });

  it("should return success when user create a reservation", async () => {
    const reservationData = {
      number_of_customers: 15,
      date: "2023-10-09",
      time: "12:30",
      name: "User2",
      description: "Vue sur la mer",
    };

    await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${token}`)
      .send(reservationData)
      .expect(201);
  });

  it("should return an error when data is missing", async () => {
    await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${token}`)
      .send({
        date: "2023-10-09",
        time: "12:30",
        name: "User2",
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message);
      });
  });

  // Test for invalid date format
  it("should return an error for invalid date format", async () => {
    const response = await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${token}`)
      .send({
        number_of_customers: 4,
        date: "10-12-2000",
        time: "12:30",
        name: "User3",
      })
      .expect(400);

    expect(response.body.message).toEqual("Invalid date format");
  });

  // Test for invalid time format
  it("should return an error for invalid time format", async () => {
    const response = await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${token}`)
      .send({
        number_of_customers: 4,
        date: "2023-10-09",
        time: "12:60", // Invalid time
        name: "User3",
      })
      .expect(400);

    expect(response.body.message).toEqual("Invalid time format");
  });

  it("should require authentication to create a reservation", async () => {
    await request(app)
      .post("/api/reservation/create")
      .send({
        number_of_customers: 2,
        date: "2023-10-10",
        time: "19:00",
        name: "Anonymous",
      })
      .expect(401)
      .expect((response) => {
        expect(response.body.auth).toEqual(false);
        expect(response.body.message).toEqual("Token required");
      });
  });
});
