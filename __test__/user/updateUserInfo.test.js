const request = require("supertest");
const app = require("../../app.js");

describe("PUT /api/users/:id/update - Update User Information", () => {
  let aliceToken, bobToken;
  let aliceId = 3;

  beforeAll(async () => {
    let res = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      user_password: "alice12345678",
    });
    aliceToken = res.body.token;

    res = await request(app).post("/api/signin").send({
      email: "bob@gmail.com",
      user_password: "bob12345678",
    });
    bobToken = res.body.token;
  });

  it("should allow a user to update their own information", async () => {
    const updatedData = {
      firstname: "AliceUpdated",
      lastname: "SmithUpdated",
      email: "alice@gmail.com",
      phone: "9876543210",
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
      phone: "9876501234",
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
      phone: "0000000000",
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
      phone: "9876543211",
    };

    await request(app)
      .put(`/api/users/${aliceId}/update`)
      .send(updatedData)
      .expect(401);
  });
});
