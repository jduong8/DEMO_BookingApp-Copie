const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const User = db.user;

describe("POST /api/users", () => {
  afterEach(async () => {
    const user = await User.findOne({
      where: { email: "testuser@example.com" },
    });
    if (user) {
      await user.destroy();
    }
  });

  it("should create a new user and return user data without password", async () => {
    const userData = {
      firstname: "User1",
      lastname: "Test",
      email: "testuser@example.com",
      phone: "0123456789",
      user_password: "Test1234",
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
    expect(res.body.user.user_role).toBe("Client");
    expect(res.body.user.user_password).not.toBeDefined();
  });

  it("should reject an invalid email", async () => {
    const userData = {
      firstname: "User1",
      lastname: "Test",
      email: "invalid-email",
      phone: "0123456789",
      user_password: "Test1234",
    };

    const res = await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(res.body.message).toBe("Invalid email");
  });

  it("should require all fields to be filled", async () => {
    // Test with a missing field (missing email)
    const userData = {
      firstname: "User1",
      lastname: "Test",
      phone: "0123456789",
      user_password: "Test1234",
    };

    const res = await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(res.body.message).toBe("All fields are required");
  });

  it("should reject numerical data when a string is expected", async () => {
    const userData = {
      firstname: 12345,
      lastname: "Test",
      email: "testuser@example.com",
      phone: "0123456789",
      user_password: "Test1234",
    };

    const res = await request(app)
      .post("/api/signup")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body.error).toContain("firstname must be a string");
  });
});
