const request = require("supertest");
const app = require("../../app.js");
const CATEGORY = require("../../models/category.model.js");

describe("POST /products/create - Add New Product", () => {
  let masterToken, adminToken, clientToken;

  beforeAll(async () => {
    let master = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      user_password: "master12345678",
    });
    masterToken = master.body.token;

    let admin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      user_password: "clark12345678",
    });
    adminToken = admin.body.token;

    let client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      user_password: "alice12345678",
    });
    clientToken = client.body.token;
  });

  it("should allow an admin to create a product", async () => {
    const newProduct = {
      name: "Admin Product",
      description: "Admin Description",
      price: 20.0,
      category: CATEGORY.STARTER,
    };

    const response = await request(app)
      .post("/api/products/create")
      .set("Authorization", `${adminToken}`)
      .send(newProduct);

    expect(response.status).toBe(201);
  });

  it("should prevent a client from creating a product", async () => {
    const newProduct = {
      name: "Client Product",
      description: "Client Description",
      price: 10.0,
      category: CATEGORY.STARTER,
    };

    const response = await request(app)
      .post("/api/products/create")
      .set("Authorization", `${clientToken}`)
      .send(newProduct);

    expect(response.status).toBe(403);
  });
});
