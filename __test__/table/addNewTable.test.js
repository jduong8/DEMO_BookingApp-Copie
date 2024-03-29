const request = require("supertest");
const app = require("../../app.js");
const Table = require("../../db.js").table;

describe("POST /api/table/create - Add New Table", () => {
  let adminToken, masterToken, clientToken;

  // Connexion pour les différents rôles
  beforeAll(async () => {
    // Connexion en tant qu'Admin
    const admin = await request(app)
      .post("/api/signin")
      .send({ email: "superman@example.com", user_password: "clark12345678" });
    adminToken = admin.body.token;

    // Connexion en tant que Master
    const master = await request(app)
      .post("/api/signin")
      .send({ email: "master@example.com", user_password: "master12345678" });
    masterToken = master.body.token;

    // Connexion en tant que Client
    const client = await request(app)
      .post("/api/signin")
      .send({ email: "alice@example.com", user_password: "alice12345678" });
    clientToken = client.body.token;
  });

  it("should prevent a client from creating a table", async () => {
    const tableData = { seats_count: 2 };

    const response = await request(app)
      .post("/api/table/create")
      .set("Authorization", `${clientToken}`)
      .send(tableData);

    expect(response.status).toBe(403);
  });

  it("should return a 400 error for invalid seats_count", async () => {
    const invalidTableData = { seats_count: -1 };

    const response = await request(app)
      .post("/api/table/create")
      .set("Authorization", `${adminToken}`)
      .send(invalidTableData);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Invalid seats_count. Must be a positive integer.",
    );
  });
});
