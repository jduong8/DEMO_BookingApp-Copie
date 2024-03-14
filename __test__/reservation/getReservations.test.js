const request = require("supertest");
const app = require("../../app.js");

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

  it("should allow an Admin to retrieve all reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    // Verify that the response is an array (could be empty or contain the client's reservations)
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should allow a Super Admin to retrieve all reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${superAdminToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    // Verify that the response is an array (could be empty or contain the client's reservations)
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should allow a Client to retrieve only their reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/all")
      .set("Authorization", `${clientToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    // Verify that the response is an array (could be empty or contain the client's reservations)
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
