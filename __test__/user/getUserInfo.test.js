const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("User: GET - User Informations", () => {
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
    masterToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    adminToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = res.body.token;
  });

  it("should return the MASTER user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.email).toEqual("master@gmail.com");
    expect(res.body.role).toEqual(USER_ROLE.MASTER);
    expect(res.body.password).toBeUndefined();
  });

  it("should return the ADMIN user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", adminToken)
      .expect(200);

    expect(res.body.email).toEqual("superman@gmail.com");
    expect(res.body.role).toEqual(USER_ROLE.ADMIN);
    expect(res.body.password).toBeUndefined();
  });

  it("should return the CLIENT user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", clientToken)
      .expect(200);

    expect(res.body.email).toEqual("alice@gmail.com");
    expect(res.body.role).toEqual(USER_ROLE.CLIENT);
    expect(res.body.password).toBeUndefined();
  });
});
