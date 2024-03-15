const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const checkAuthorOrAdmin = require("../../middlewares/checkAuthorOrAdmins.middleware.js");

describe("DELETE /api/users/:id - Delete User", () => {
  let adminToken, tempUserId;

  beforeAll(async () => {
    const mockUser = {
      firstname: "Temp",
      lastname: "User",
      email: "tempuser@example.com",
      phone: "1234567890",
      user_password: "Temp1234",
    };
    let userCreationRes = await request(app).post("/api/signup").send(mockUser);
    expect(userCreationRes.body).toHaveProperty("user");
    tempUserId = userCreationRes.body.user.id;

    let adminRes = await request(app).post("/api/signin").send({
      email: "superman@example.com",
      user_password: "clark12345678",
    });
    adminToken = adminRes.body.token;
  });

  it("should successfully delete an existing user", async () => {
    await request(app)
      .delete(`/api/users/${tempUserId}/delete`)
      .set("Authorization", adminToken)
      .expect(200);
  });

  it("should return a 404 error if the user does not exist", async () => {
    // At this point, the user is already deleted, attempting again should result in 404
    await request(app)
      .delete(`/api/users/${tempUserId}/delete`)
      .set("Authorization", adminToken)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("User not found.");
      });
  });
});
