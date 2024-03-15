const request = require("supertest");
const app = require("../../app.js");
const Product = require("../../db.js").product;

describe("GET /api/product/:id - Get One Product", () => {
  beforeAll(() => {
    // Mock Product.findByPk pour retourner un produit factice ou null
    jest.spyOn(Product, "findByPk").mockImplementation((id) => {
      if (id === "1") {
        return Promise.resolve({
          id: 1,
          name: "Product 1",
          price: 10.99,
          toJSON() {
            return this;
          },
        });
      } else {
        return Promise.resolve(null);
      }
    });
  });

  it("should fetch a single product and format its price correctly", async () => {
    const response = await request(app).get("/api/product/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Product 1",
      price: "10,99 €",
    });
  });

  it("should return a 404 error if the product does not exist", async () => {
    const response = await request(app).get("/api/product/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Product not found");
  });

  afterAll(() => {
    // Restaurez la mise en œuvre originale
    Product.findByPk.mockRestore();
  });
});
