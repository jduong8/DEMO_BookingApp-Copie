const request = require("supertest");
const app = require("../../app.js");
const CATEGORY = require("../../models/category.model.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");
const createProductMock = require("../../mocks/products.mock.js");

describe("PUT /api/products/update/:id - Update Product", () => {
  let adminToken, masterToken, clientToken, productId;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    const productsMock = await createProductMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);
    const products = await db.Product.bulkCreate(productsMock);

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

    productId = products[0].id;
  });

  it("should allow an admin to update a product", async () => {
    const updatedProduct = {
      name: "Updated Product",
      description: "Updated description",
      price: 15.99,
      category: CATEGORY.STARTER,
    };

    const response = await request(app)
      .put(`/api/products/update/${productId}`)
      .set("Authorization", `${adminToken}`)
      .send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body.product.name).toEqual(updatedProduct.name);
  });

  it("should prevent a client from updating a product", async () => {
    const updatedProduct = {
      name: "Unauthorized Update",
      description: "This update should fail",
      price: 20.99,
      category: CATEGORY.DISH,
    };

    const response = await request(app)
      .put(`/api/products/update/${productId}`)
      .set("Authorization", `${clientToken}`)
      .send(updatedProduct);

    expect(response.status).toBe(403);
  });

  it("should return a 404 error if the product does not exist", async () => {
    const nonExistentProductId = 999999;
    const updatedProduct = {
      name: "Nonexistent Product",
      description: "This product does not exist",
      price: 15.99,
      category: CATEGORY.DESSERT,
    };

    const response = await request(app)
      .put(`/api/products/update/${nonExistentProductId}`)
      .set("Authorization", `${adminToken}`)
      .send(updatedProduct);

    expect(response.status).toBe(404);
  });
});
