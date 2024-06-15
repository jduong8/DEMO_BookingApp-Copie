const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const { createClientMock } = require("../../mocks/users.mock.js");

describe("Authentication: POST - Create new account", () => {
  beforeAll(async () => {
    const clients = await createClientMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clients);
  });

  it("should create a new user and return user data without password", async () => {
    const userData = {
      firstname: "John",
      lastname: "Test",
      email: "testuser@gmail.com",
      phone: "0623456789",
      password: "Test1234",
    };

    const res = await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body.message).toBe("User created");
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user.firstname).toBe(userData.firstname);
    expect(res.body.user.lastname).toBe(userData.lastname);
    expect(res.body.user.phone).toBe(userData.phone);
    expect(res.body.user.role).toBe("Client");
    expect(res.body.user.password).not.toBeDefined();
  });

  it("should reject an invalid email", async () => {
    const userData = {
      firstname: "John",
      lastname: "Test",
      email: "invalid-email",
      phone: "0612345678",
      password: "Test1234",
    };

    await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);
  });

  it("should require all fields to be filled", async () => {
    const userData = {
      firstname: "John",
      lastname: "Test",
      phone: "0612345678",
      password: "Test1234",
    };

    await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);
  });

  it("should reject numerical data when a string is expected", async () => {
    const userData = {
      firstname: 12345,
      lastname: "Test",
      email: "testuser@gmail.com",
      phone: "0612345678",
      password: "Test1234",
    };

    await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);
  });

  it("should return an error when email is already used", async () => {
    const userData = {
      firstname: "Alice",
      lastname: "Test",
      email: "alice@gmail.com",
      phone: "0612345678",
      password: "Test1234",
    };

    await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);
  });
});
