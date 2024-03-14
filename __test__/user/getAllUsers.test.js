const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");

describe("GET /api/users - Get All Users", () => {
  let masterToken, adminToken, clientToken;

  beforeAll(async () => {
    // Authentification du MASTER
    let res = await request(app).post("/api/signin").send({
      email: "master@example.com",
      user_password: "master12345678",
    });
    expect(res.body).toHaveProperty("token");
    masterToken = res.body.token;

    // Authentification d'un ADMIN
    res = await request(app).post("/api/signin").send({
      email: "superman@example.com",
      user_password: "clark12345678",
    });
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;

    // Authentification d'un CLIENT
    res = await request(app).post("/api/signin").send({
      email: "alice@example.com",
      user_password: "alice12345678",
    });
    expect(res.body).toHaveProperty("token");
    clientToken = res.body.token;
  });

  it("MASTER should retrieve ADMIN and CLIENT users but not themselves", async () => {
    const res = await request(app)
      .get("/api/users/all")
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.some((user) => user.email === "master@example.com")).toBe(
      false,
    );
    expect(res.body.some((user) => user.user_role === USER_ROLE.ADMIN)).toBe(
      true,
    );
    expect(res.body.some((user) => user.user_role === USER_ROLE.CLIENT)).toBe(
      true,
    );
  });

  it("ADMIN should retrieve only CLIENT users", async () => {
    const res = await request(app)
      .get("/api/users/all")
      .set("Authorization", adminToken)
      .expect(200);

    expect(res.body.every((user) => user.user_role === USER_ROLE.CLIENT)).toBe(
      true,
    );
  });

  it("CLIENT should not be able to retrieve any users", async () => {
    await request(app)
      .get("/api/users/all")
      .set("Authorization", clientToken)
      .expect(403)
      .expect((response) => {
        expect(response.body.message).toEqual("Access denied");
      });
  });
});
