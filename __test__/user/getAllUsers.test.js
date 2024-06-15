const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("User: GET - All Users", () => {
  let masterToken, adminToken, clientToken;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);

    let res = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      password: "master12345678",
    });
    expect(res.body).toHaveProperty("token");
    masterToken = res.body.token;

    // Authentification d'un ADMIN
    res = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;

    // Authentification d'un CLIENT
    res = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    expect(res.body).toHaveProperty("token");
    clientToken = res.body.token;
  });

  it("MASTER should retrieve ADMIN and CLIENT users but not themselves", async () => {
    const res = await request(app)
      .get("/api/users/all")
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.some((user) => user.email === "master@gmail.com")).toBe(
      false,
    );
    expect(res.body.some((user) => user.role === USER_ROLE.ADMIN)).toBe(true);
    expect(res.body.some((user) => user.role === USER_ROLE.CLIENT)).toBe(true);
  });

  it("ADMIN should retrieve only CLIENT users", async () => {
    const res = await request(app)
      .get("/api/users/all")
      .set("Authorization", adminToken)
      .expect(200);

    expect(res.body.every((user) => user.role === USER_ROLE.CLIENT)).toBe(true);
  });

  it("CLIENT should not be able to retrieve any users", async () => {
    const response = await request(app)
      .get("/api/users/all")
      .set("Authorization", clientToken)
      .expect(403);

    expect(response.body.error).toEqual("Access denied");
  });
});
