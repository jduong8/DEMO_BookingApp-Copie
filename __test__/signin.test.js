const request = require("supertest");
const app = require("../app.js");
const db = require("../db.js");
const User = db.user;
const bcrypt = require("bcrypt");

describe("POST /api/signin", () => {
  // Créer un utilisateur de test dans la base de données avant de commencer les tests
  beforeAll(async () => {
    // Utilisez bcrypt pour hacher le mot de passe
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    await request(app).post("/api/signup").send({
      firstname: "User1",
      lastname: "Test",
      email: "testuser@example.com",
      phone: "0123456789",
      user_password: "testpassword",
    });
  });

  // Supprimer l'utilisateur de test après avoir terminé les tests
  afterAll(async () => {
    await User.destroy({ where: { email: "testuser@example.com" } });
  });

  it("should return a token for valid login credentials", async () => {
    const res = await request(app)
      .post("/api/signin")
      .send({
        email: "testuser@example.com",
        user_password: "testpassword",
      })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("Connexion succeed");
  });

  it("should return an error for invalid password", async () => {
    await request(app)
      .post("/api/signin")
      .send({
        email: "testuser@example.com",
        user_password: "wrongpassword",
      })
      .expect(400);
  });

  it("should return an error for non-existent email", async () => {
    await request(app)
      .post("/api/signin")
      .send({
        email: "nonexistent@example.com",
        user_password: "testpassword",
      })
      .expect(400);
  });
});
