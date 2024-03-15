const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");

describe("GET /api/user/info - Get User Information", () => {
  let masterToken, adminToken, clientToken;

  beforeAll(async () => {
    let res = await request(app).post("/api/signin").send({
      email: "master@example.com",
      user_password: "master12345678",
    });
    expect(res.body).toHaveProperty("token");
    masterToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "superman@example.com",
      user_password: "clark12345678",
    });
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "alice@example.com",
      user_password: "alice12345678",
    });
    expect(res.body).toHaveProperty("token");
    clientToken = res.body.token;
  });

  it("should return the MASTER user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.email).toEqual("master@example.com");
    expect(res.body.user_role).toEqual(USER_ROLE.MASTER);
    expect(res.body.user_password).toBeUndefined();
  });

  it("should return the ADMIN user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", adminToken)
      .expect(200);

    expect(res.body.email).toEqual("superman@example.com");
    expect(res.body.user_role).toEqual(USER_ROLE.ADMIN);
    expect(res.body.user_password).toBeUndefined();
  });

  it("should return the CLIENT user's information correctly", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", clientToken)
      .expect(200);

    expect(res.body.email).toEqual("alice@example.com");
    expect(res.body.user_role).toEqual(USER_ROLE.CLIENT);
    expect(res.body.user_password).toBeUndefined();
  });
});
