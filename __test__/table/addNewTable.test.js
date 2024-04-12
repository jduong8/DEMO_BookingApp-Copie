const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("Table: POST - Add New Table", () => {
  let adminToken, masterToken, clientToken;

  // Connexion pour les différents rôles
  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);

    // Connexion en tant qu'Admin
    const admin = await request(app)
      .post("/api/signin")
      .send({ email: "superman@gmail.com", password: "clark12345678" });
    adminToken = admin.body.token;

    // Connexion en tant que Master
    const master = await request(app)
      .post("/api/signin")
      .send({ email: "master@gmail.com", password: "master12345678" });
    masterToken = master.body.token;

    // Connexion en tant que Client
    const client = await request(app)
      .post("/api/signin")
      .send({ email: "alice@gmail.com", password: "alice12345678" });
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

  it("should allow an Admin from creating a table", async () => {
    const tableData = { seats_count: 2 };

    const response = await request(app)
      .post("/api/table/create")
      .set("Authorization", `${adminToken}`)
      .send(tableData);

    expect(response.status).toBe(200);
  });

  it("should allow a Master from creating a table", async () => {
    const tableData = { seats_count: 2 };

    const response = await request(app)
      .post("/api/table/create")
      .set("Authorization", `${masterToken}`)
      .send(tableData);

    expect(response.status).toBe(200);
  });

  it("should return a 400 error for an invalid number of seats when creating a table", async () => {
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
