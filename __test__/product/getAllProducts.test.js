const request = require("supertest");
const app = require("../../app.js");
const Product = require("../../db.js").product;

describe("GET /api/products/all - Get All Products", () => {
  beforeAll(() => {
    // Mock Product.findAll pour retourner des données factices
    jest.spyOn(Product, "findAll").mockResolvedValue([
      {
        id: 1,
        name: "Product 1",
        price: 10.99,
        toJSON() {
          return this;
        },
      },
      {
        id: 2,
        name: "Product 2",
        price: 20.49,
        toJSON() {
          return this;
        },
      },
    ]);
  });

  it("should fetch all products and format their prices correctly", async () => {
    const response = await request(app).get("/api/products/all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Product 1", price: "10,99 €" },
      { id: 2, name: "Product 2", price: "20,49 €" },
    ]);
  });

  afterAll(() => {
    // Restaurez la mise en œuvre originale
    Product.findAll.mockRestore();
  });
});
