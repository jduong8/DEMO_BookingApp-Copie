const request = require("supertest");
const app = require("../../app.js");

describe("GET /api/tables - Get All Tables", () => {
  let clientToken;

  beforeAll(async () => {
    // Connexion en tant que client pour récupérer le token
    let res = await request(app)
      .post("/api/signin")
      .send({ email: "david@example.com", user_password: "david12345678" });
    clientToken = res.body.token;
  });

  it("should fetch all tables", async () => {
    const response = await request(app)
      .get("/api/tables/all")
      .set("Authorization", `${clientToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
