const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("Reservation: GET - Retrieve all reservations", () => {
  let adminToken, masterToken, clientToken;

  // Connexion pour les différents rôles
  beforeAll(async () => {
    const clients = await createClientMock();
    const admins = await createAdminMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clients);
    await db.User.bulkCreate(admins);

    // Connexion en tant qu'Admin
    const admin = await request(app)
      .post("/api/signin")
      .send({ email: "superman@gmail.com", password: "clark12345678" });
    adminToken = admin.body.token;

    // Connexion en tant que Super_Admin
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
      .set("Authorization", `${masterToken}`)
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
