const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const User = db.user;
const bcrypt = require("bcrypt");

describe("POST /api/signin", () => {
  it("should return a token for valid login credentials", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "alice@example.com",
        user_password: "alice12345678",
      })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("Connexion succeed");
  });

  it("should return an error for invalid password", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "testuser@example.com",
        user_password: "wrongpassword",
      })
      .expect(400);

    expect(res.body.message).toBe("Incorrect user or password");
  });

  it("should return an error for non-existent email", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "nonexistent@example.com",
        user_password: "testpassword",
      })
      .expect(400);

    expect(res.body.message).toBe("Incorrect user or password");
  });
});
