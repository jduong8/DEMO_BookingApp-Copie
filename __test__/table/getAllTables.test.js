const request = require("supertest");
const app = require("../../app.js");

describe("GET /api/tables - Get All Tables", () => {
  let clientToken, adminToken, masterToken;

  beforeAll(async () => {
    // Connexion en tant que client pour récupérer le token
    let client = await request(app)
      .post("/api/signin")
      .send({ email: "david@example.com", user_password: "david12345678" });
    clientToken = client.body.token;

    // Connexion en tant que client pour récupérer le token
    let admin = await request(app)
      .post("/api/signin")
      .send({ email: "superman@example.com", user_password: "clark12345678" });
    adminToken = admin.body.token;

    // Connexion en tant que client pour récupérer le token
    let master = await request(app)
      .post("/api/signin")
      .send({ email: "master@example.com", user_password: "master12345678" });
    masterToken = master.body.token;
  });

  it("should allow a Client to get all tables", async () => {
    const response = await request(app)
      .get("/api/tables/all")
      .set("Authorization", `${clientToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should allow an Admin to get all tables", async () => {
    const response = await request(app)
      .get("/api/tables/all")
      .set("Authorization", `${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should allow Master to get all tables", async () => {
    const response = await request(app)
      .get("/api/tables/all")
      .set("Authorization", `${masterToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
