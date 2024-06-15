const request = require("supertest");
const app = require("../../app.js");
const CATEGORY = require("../../models/category.model.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");

describe("Product: POST - Add New Product", () => {
  let masterToken, adminToken, clientToken;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);

    let master = await request(app).post("/api/signin").send({
      email: "master@gmail.com",
      password: "master12345678",
    });
    masterToken = master.body.token;

    let admin = await request(app).post("/api/signin").send({
      email: "superman@gmail.com",
      password: "clark12345678",
    });
    adminToken = admin.body.token;

    let client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = client.body.token;
  });

  it("should allow Admin to create a product", async () => {
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

  it("should allow Master to create a product", async () => {
    const newProduct = {
      name: "Master Product",
      description: "Master Description",
      price: 20.0,
      category: CATEGORY.DISH,
    };

    const response = await request(app)
      .post("/api/products/create")
      .set("Authorization", `${masterToken}`)
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
