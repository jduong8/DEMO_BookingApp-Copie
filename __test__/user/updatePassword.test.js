const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const { createClientMock } = require("../../mocks/users.mock.js");

describe("User: POST - Update Password", () => {
  let clientToken;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);

    // Sign in the new user
    const client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = client.body.token;
  });

  it("should successfully update the password with valid old and new passwords", async () => {
    await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", clientToken)
      .send({
        oldPassword: "alice12345678",
        newPassword: "newStrongPassword123",
      })
      .expect(200);
  });

  it("should reject the update if the old password is incorrect", async () => {
    const response = await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", clientToken)
      .send({
        oldPassword: "wrongInitialPassword",
        newPassword: "anotherNewPassword123",
      })
      .expect(400);

    expect(response.body.message).toEqual("Incorrect old password");
  });

  it("should enforce new password length requirements", async () => {
    const response = await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", clientToken)
      .send({
        oldPassword: "alice12345678",
        newPassword: "short",
      })
      .expect(400);

    expect(response.body.message).toEqual(
      "New password must be at least 8 characters long",
    );
  });
});
