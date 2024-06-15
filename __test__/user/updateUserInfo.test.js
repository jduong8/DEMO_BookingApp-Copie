const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const { createClientMock } = require("../../mocks/users.mock.js");

describe("User: PUT - Update User Information", () => {
  let aliceToken, bobToken;
  let aliceId;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    await db.sequelize.sync({ force: true });
    const clients = await db.User.bulkCreate(clientsMock);

    const alice = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    aliceToken = alice.body.token;
    aliceId = clients[0].id;

    const bob = await request(app).post("/api/signin").send({
      email: "bob@gmail.com",
      password: "bob12345678",
    });
    bobToken = bob.body.token;
  });

  it("should allow a user to update their own information", async () => {
    const updatedData = {
      firstname: "AliceUpdated",
      lastname: "Smith",
      email: "alice@gmail.com",
      phone: "0612345678",
    };

    await request(app)
      .put(`/api/users/${aliceId}/update`)
      .set("Authorization", aliceToken)
      .send(updatedData)
      .expect(200);
  });

  it("should not allow a user to update another user's information", async () => {
    const updatedData = {
      firstname: "BobUpdated",
      lastname: "JonesUpdated",
      email: "bob@gmail.com",
      phone: "0612345678",
    };

    await request(app)
      .put(`/api/users/${aliceId}/update`)
      .set("Authorization", bobToken)
      .send(updatedData)
      .expect(403);
  });

  it("should return an error if the user does not exist", async () => {
    const nonExistentUserId = 999999;
    const updatedData = {
      firstname: "NonExistent",
      lastname: "User",
      email: "nonexistent@example.com",
      phone: "0612345678",
    };

    await request(app)
      .put(`/api/users/${nonExistentUserId}/update`)
      .set("Authorization", aliceToken)
      .send(updatedData)
      .expect(404);
  });

  it("should reject unauthorized requests", async () => {
    const updatedData = {
      firstname: "AliceSecondUpdate",
      lastname: "SmithSecondUpdate",
      email: "alicesecondupdate@example.com",
      phone: "0612345678",
    };

    await request(app)
      .put(`/api/users/${aliceId}/update`)
      .send(updatedData)
      .expect(401);
  });
});
