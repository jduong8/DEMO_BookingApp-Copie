const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const { createClientMock } = require("../../mocks/users.mock.js");

describe("Authentication: POST Login", () => {
  beforeAll(async () => {
    const clients = await createClientMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clients);
  });

  it("should return a token", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "alice@gmail.com",
        password: "alice12345678",
      })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("Connexion succeed");
  });

  it("should return an error for invalid password", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "alice@gmail.com",
        password: "wrongpassword",
      })
      .expect(400);

    expect(res.body.message).toBe("Incorrect user or password");
  });

  it("should return an error for non-existent email", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "nonexistent@example.com",
        password: "testpassword",
      })
      .expect(400);

    expect(res.body.message).toBe("Incorrect user or password");
  });
});
