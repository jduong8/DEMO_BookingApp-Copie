const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");
const createTableMock = require("../../mocks/tables.mock.js");

describe("Table: GET - Get All Tables", () => {
  let clientToken, adminToken, masterToken;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    const tablesMock = await createTableMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);
    await db.Table.bulkCreate(tablesMock);

    // Connexion en tant que client pour récupérer le token
    let client = await request(app)
      .post("/api/signin")
      .send({ email: "david@gmail.com", password: "david12345678" });
    clientToken = client.body.token;

    // Connexion en tant que client pour récupérer le token
    let admin = await request(app)
      .post("/api/signin")
      .send({ email: "superman@gmail.com", password: "clark12345678" });
    adminToken = admin.body.token;

    // Connexion en tant que client pour récupérer le token
    let master = await request(app)
      .post("/api/signin")
      .send({ email: "master@gmail.com", password: "master12345678" });
    masterToken = master.body.token;
  });

  it("should prevent Client to get all tables", async () => {
    const response = await request(app)
      .get("/api/tables/all")
      .set("Authorization", `${clientToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Access denied.");
  });

  it("should allow Admin to get all tables", async () => {
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
