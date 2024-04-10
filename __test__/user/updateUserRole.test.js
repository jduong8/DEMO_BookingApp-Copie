const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");
const db = require("../../db.js");
const User = db.user;

describe("PUT /api/users/:userId/role - Update User Role", () => {
  let masterToken, adminToken, clientToken, targetUserId;

  beforeAll(async () => {
    let res = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      user_password: "master12345678",
    });
    masterToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      user_password: "clark12345678",
    });
    adminToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      user_password: "alice12345678",
    });
    clientToken = res.body.token;

    const targetUserRes = await User.findOne({
      where: { email: "alice@gmail.com" },
    });
    targetUserId = targetUserRes.id;
  });

  afterAll(async () => {
    await User.update(
      { user_role: USER_ROLE.CLIENT },
      { where: { id: targetUserId } },
    );
  });

  it("should successfully update the user's role to ADMIN", async () => {
    const res = await request(app)
      .put(`/api/users/${targetUserId}/role/admin`)
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.message).toContain(
      "User role updated to Admin successfully.",
    );
    expect(res.body.user.user_role).toEqual(USER_ROLE.ADMIN);
  });

  it("should return a 404 error if the user is not found", async () => {
    const nonExistentUserId = 999999;

    await request(app)
      .put(`/api/users/${nonExistentUserId}/role/admin`)
      .set("Authorization", masterToken)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("User not found.");
      });
  });

  it("ADMIN should not be able to update user roles", async () => {
    await request(app)
      .put(`/api/users/${targetUserId}/role/admin`)
      .set("Authorization", adminToken)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual("Access denied.");
      });
  });

  it("CLIENT should not be able to update user roles", async () => {
    await request(app)
      .put(`/api/users/${targetUserId}/role/admin`)
      .set("Authorization", clientToken)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual("Access denied.");
      });
  });
});
