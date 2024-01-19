const request = require("supertest");
const app = require("../app.js");

describe("POST /api/reservations", () => {
  let clientToken;

  beforeAll(async () => {
    // Connexion en tant que client pour récupérer le token
    let res = await request(app)
      .post("/api/signin")
      .send({ email: "alice@example.com", user_password: "alice12345678" });
    clientToken = res.body.token;
  });

  it("should allow a Client to create a reservation", async () => {
    const reservationData = {
      number_of_customers: 15,
      reservation_date: "2023-10-09",
      reservation_time: "12:30",
      reservation_name: "User2",
      reservation_note: "Vue sur la mer",
    };

    await request(app)
      .post("/api/reservations")
      .set("Authorization", `${clientToken}`)
      .send(reservationData)
      .expect(200); // Vérifie que la création de la réservation réussit
  });
});
