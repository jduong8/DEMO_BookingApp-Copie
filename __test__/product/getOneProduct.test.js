const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const createProductMock = require("../../mocks/products.mock.js");

describe("Product: GET - Get One Product", () => {
  let productId;
  beforeAll(async () => {
    const productsMock = await createProductMock();
    await db.sequelize.sync({ force: true });
    const products = await db.Product.bulkCreate(productsMock);

    productId = products[0].id;
  });

  it("should fetch a single product and format its price correctly", async () => {
    const response = await request(app).get(`/api/product/${productId}`);

    expect(response.status).toBe(200);
  });

  it("should return a 404 error if the product does not exist", async () => {
    const response = await request(app).get("/api/product/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Product not found");
  });
});
