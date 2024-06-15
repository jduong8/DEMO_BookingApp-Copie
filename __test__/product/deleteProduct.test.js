const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const {
  createClientMock,
  createAdminMock,
} = require("../../mocks/users.mock.js");
const createProductMock = require("../../mocks/products.mock.js");

describe("Product: DELETE - Delete Product", () => {
  let masterToken, adminToken, clientToken, productToDeleteId;

  beforeAll(async () => {
    const clientsMock = await createClientMock();
    const adminsMock = await createAdminMock();
    const productsMock = await createProductMock();
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(clientsMock);
    await db.User.bulkCreate(adminsMock);
    const products = await db.Product.bulkCreate(productsMock);

    productToDeleteId = products[0].id;

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

    const client = await request(app).post("/api/signin").send({
      email: "alice@gmail.com",
      password: "alice12345678",
    });
    clientToken = client.body.token;
  });

  it("should allow an admin to delete a product", async () => {
    const response = await request(app)
      .delete(`/api/products/delete/${productToDeleteId}`)
      .set("Authorization", `${adminToken}`)
      .expect(200);

    expect(response.body.message).toEqual("Product deleted successfully.");
  });

  it("should prevent a client from deleting a product", async () => {
    await request(app)
      .delete(`/api/products/delete/${productToDeleteId}`)
      .set("Authorization", `${clientToken}`)
      .expect(403);
  });

  it("should return a 404 error if the product does not exist", async () => {
    await request(app)
      .delete(`/api/products/delete/${productToDeleteId}`)
      .set("Authorization", `${adminToken}`)
      .expect(404);
  });
});
