const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("User: DELETE - Delete User", () => {
  let adminToken, masterToken, client1Token, client2Token;
  let client1Id, client2Id, client3Id, masterId;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    await db.sequelize.sync({ force: true });
    const clients = await db.User.bulkCreate(clientsMock);
    const admins = await db.User.bulkCreate(adminsMock);

    let adminLogin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    adminToken = adminLogin.body.token;

    let masterLogin = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      password: "master12345678",
    });
    masterToken = masterLogin.body.token;
    masterId = admins[0].id;

    let client1Login = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    client1Token = client1Login.body.token;
    client1Id = clients[0].id;

    let client2Login = await request(app).post("/api/signin").send({
      email: "bob@gmail.com",
      password: "bob12345678",
    });
    client2Token = client2Login.body.token;
    client2Id = clients[1].id;

    client3Id = clients[2].id;
  });

  it("an ADMIN should not be able to delete a MASTER user", async () => {
    await request(app)
      .delete(`/api/users/${masterId}/delete`)
      .set("Authorization", adminToken)
      .expect(403);
  });

  it("a MASTER user should be able to delete any account", async () => {
    await request(app)
      .delete(`/api/users/${client3Id}/delete`)
      .set("Authorization", masterToken)
      .expect(200);
  });

  it("an ADMIN should be able to delete a CLIENT account", async () => {
    await request(app)
      .delete(`/api/users/${client2Id}/delete`)
      .set("Authorization", adminToken)
      .expect(200);
  });

  it("a CLIENT should not be able to delete another CLIENT account", async () => {
    await request(app)
      .delete(`/api/users/${client1Id}/delete`)
      .set("Authorization", client2Token)
      .expect(403);
  });

  it("a CLIENT should be able to delete their own account", async () => {
    await request(app)
      .delete(`/api/users/${client1Id}/delete`)
      .set("Authorization", client1Token)
      .expect(200);
  });
});
