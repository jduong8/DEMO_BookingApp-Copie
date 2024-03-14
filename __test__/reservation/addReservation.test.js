const request = require("supertest");
const app = require("../../app.js");

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
      .post("/api/reservation/create")
      .set("Authorization", `${clientToken}`)
      .send(reservationData)
      .expect(200); // Vérifie que la création de la réservation réussit
  });

  it("should return an error when data is missing", async () => {
    const reservationData = {
      // number_of_customers est manquant
      reservation_date: "2023-10-09",
      reservation_time: "12:30",
      reservation_name: "User2",
    };

    await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${clientToken}`)
      .send(reservationData)
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toEqual(
          "Missing required reservation details",
        );
      });
  });

  // Test for invalid date format
  it("should return an error for invalid date format", async () => {
    const reservationData = {
      number_of_customers: 4,
      reservation_date: "10-12-2000", // Invalid date format
      reservation_time: "12:30",
      reservation_name: "User3",
    };

    await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${clientToken}`)
      .send(reservationData)
      .expect(422)
      .expect((response) => {
        expect(response.body.error).toEqual("Invalid date format");
      });
  });

  // Test for invalid time format
  it("should return an error for invalid time format", async () => {
    const reservationData = {
      number_of_customers: 4,
      reservation_date: "2023-10-09",
      reservation_time: "12:60", // Invalid time
      reservation_name: "User3",
    };

    await request(app)
      .post("/api/reservation/create")
      .set("Authorization", `${clientToken}`)
      .send(reservationData)
      .expect(422)
      .expect((response) => {
        expect(response.body.error).toEqual("Invalid time format");
      });
  });

  it("should require authentication to create a reservation", async () => {
    const reservationData = {
      number_of_customers: 2,
      reservation_date: "2023-10-10",
      reservation_time: "19:00",
      reservation_name: "Anonymous",
    };

    await request(app)
      .post("/api/reservation/create")
      .send(reservationData)
      .expect(401)
      .expect((response) => {
        expect(response.body.auth).toEqual(false);
        expect(response.body.message).toEqual("Token required");
      });
  });
});
