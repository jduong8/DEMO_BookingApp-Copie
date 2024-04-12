const request = require("supertest");
const app = require("../../app.js");
const db = require("../../db.js");
const createProductMock = require("../../mocks/products.mock.js");

describe("GET /api/products/all - Get All Products", () => {
  beforeAll(async () => {
    const productsMock = await createProductMock();
    await db.sequelize.sync({ force: true });
    await db.Product.bulkCreate(productsMock);
  });

  it("should fetch all products", async () => {
    const response = await request(app).get("/api/products/all");

    expect(response.status).toBe(200);
  });
});
