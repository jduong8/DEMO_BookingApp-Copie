const request = require("supertest");
const app = require("../../app.js");

describe("DELETE /api/users/:id - Delete User", () => {
  let adminToken, masterToken, masterUserId;
  let client1Token, client1Id, client2Token, client2Id, client3Token, client3Id;

  beforeAll(async () => {
    // Connexion du Master et de l'Admin
    let adminLogin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      user_password: "clark12345678",
    });
    adminToken = adminLogin.body.token;

    let masterLogin = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      user_password: "master12345678",
    });
    masterToken = masterLogin.body.token;
    let masterInfo = await request(app)
      .get("/api/user/me")
      .set("Authorization", masterToken);
    masterUserId = masterInfo.body.id;

    // Création de deux utilisateurs client
    const client1 = {
      firstname: "Client",
      lastname: "John",
      email: "client1@example.com",
      phone: "0623456789",
      user_password: "client1234",
    };
    let client1Res = await request(app).post("/api/signup").send(client1);
    client1Id = client1Res.body.user.id;

    let client1Login = await request(app).post("/api/signin").send({
      email: client1.email,
      user_password: client1.user_password,
    });
    client1Token = client1Login.body.token;

    const client2 = {
      firstname: "Client",
      lastname: "User",
      email: "client2@example.com",
      phone: "0623456789",
      user_password: "client21234",
    };
    let client2Res = await request(app).post("/api/signup").send(client2);
    client2Id = client2Res.body.user.id;

    let client2Login = await request(app).post("/api/signin").send({
      email: client2.email,
      user_password: client2.user_password,
    });
    client2Token = client2Login.body.token;

    const client3 = {
      firstname: "Client",
      lastname: "User",
      email: "client3@example.com",
      phone: "0623456789",
      user_password: "client21234",
    };
    let client3Res = await request(app).post("/api/signup").send(client3);
    client3Id = client3Res.body.user.id;

    let client3Login = await request(app).post("/api/signin").send({
      email: client3.email,
      user_password: client3.user_password,
    });
    client3Token = client3Login.body.token;
  });

  it("an ADMIN should not be able to delete a MASTER user", async () => {
    await request(app)
      .delete(`/api/users/${masterUserId}/delete`)
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
      .delete(`/api/users/${client1Id}/delete`) // Utiliser un ID différent du client lui-même
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
