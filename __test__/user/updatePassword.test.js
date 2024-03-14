const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const User = db.user;

describe("POST /api/user/password - Update Password", () => {
  let userToken, createdUserId;

  beforeAll(async () => {
    const mockUser = {
      firstname: "TestUser",
      lastname: "PasswordChange",
      email: "testpasswordchange@example.com",
      phone: "1234567890",
      user_password: "initialPassword123",
    };

    // Create a new user
    const signupResponse = await request(app)
      .post("/api/signup")
      .send(mockUser)
      .expect("Content-Type", /json/);
    console.log("signupResponse.body:", signupResponse.body);
    expect(signupResponse.body.user).toHaveProperty("id");
    createdUserId = signupResponse.body.user.id;

    // Sign in the new user
    const signinResponse = await request(app).post("/api/signin").send({
      email: mockUser.email,
      user_password: mockUser.user_password,
    });
    expect(signinResponse.body).toHaveProperty("token");
    userToken = signinResponse.body.token;
  });

  it("should successfully update the password with valid old and new passwords", async () => {
    await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", userToken)
      .send({
        oldPassword: "initialPassword123",
        newPassword: "newStrongPassword123",
      })
      .expect(200);
  });

  it("should reject the update if the old password is incorrect", async () => {
    await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", userToken)
      .send({
        oldPassword: "wrongInitialPassword",
        newPassword: "anotherNewPassword123",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("Incorrect old password");
      });
  });

  it("should enforce new password length requirements", async () => {
    await request(app)
      .post("/api/user/me/update-password")
      .set("Authorization", userToken)
      .send({
        oldPassword: "newStrongPassword123",
        newPassword: "short",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "New password must be at least 8 characters long",
        );
      });
  });

  afterAll(async () => {
    if (createdUserId) {
      await User.destroy({
        where: {
          id: createdUserId,
        },
      });
    }
  });
});
