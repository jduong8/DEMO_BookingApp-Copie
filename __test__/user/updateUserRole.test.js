const request = require("supertest");
const app = require("../../app.js");
const USER_ROLE = require("../../models/userRole.model.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("User { Master }: PUT - Update User Role", () => {
  let masterToken, adminToken, clientToken, clientId;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    await db.sequelize.sync({ force: true });
    const clients = await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);

    const master = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      password: "master12345678",
    });
    masterToken = master.body.token;

    const admin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    adminToken = admin.body.token;

    const alice = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = alice.body.token;

    clientId = clients[0].id;
  });

  it("should successfully update the user's role to ADMIN", async () => {
    const res = await request(app)
      .put(`/api/users/${clientId}/role/admin`)
      .set("Authorization", masterToken)
      .expect(200);

    expect(res.body.message).toContain(
      "User role updated to Admin successfully.",
    );
    expect(res.body.user.role).toEqual(USER_ROLE.ADMIN);
  });

  it("should return a 404 error if the user is not found", async () => {
    const nonExistentUserId = 999999;

    const response = await request(app)
      .put(`/api/users/${nonExistentUserId}/role/admin`)
      .set("Authorization", masterToken)
      .expect(404);

    expect(response.body.message).toEqual("User not found");
  });

  it("ADMIN should not be able to update user roles", async () => {
    await request(app)
      .put(`/api/users/${clientId}/role/admin`)
      .set("Authorization", adminToken)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual("Access denied.");
      });
  });

  it("CLIENT should not be able to update user roles", async () => {
    await request(app)
      .put(`/api/users/${clientId}/role/admin`)
      .set("Authorization", clientToken)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual("Access denied.");
      });
  });
});
