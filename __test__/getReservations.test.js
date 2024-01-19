const request = require("supertest");
const app = require("../app.js");

describe("GET /api/reservations/all", () => {
  let adminToken, superAdminToken, clientToken;

  // Connexion pour les différents rôles
  beforeAll(async () => {
    // Connexion en tant qu'Admin
    let res = await request(app)
      .post("/api/signin")
      .send({ email: "superman@example.com", user_password: "clark12345678" });
    adminToken = res.body.token;

    // Connexion en tant que Super_Admin
    res = await request(app)
      .post("/api/signin")
      .send({ email: "master@example.com", user_password: "master12345678" });
    superAdminToken = res.body.token;

    // Connexion en tant que Client
    res = await request(app)
      .post("/api/signin")
      .send({ email: "alice@example.com", user_password: "alice12345678" });
    clientToken = res.body.token;
  });

  it("should return a list of Reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should return a list of Reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${superAdminToken}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should return a list of Reservations", async () => {
    await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${clientToken}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
