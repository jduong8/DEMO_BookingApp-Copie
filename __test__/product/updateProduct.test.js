const request = require("supertest");
const app = require("../../app.js");
const CATEGORY = require("../../models/category.model.js");
const Product = require("../../db.js").product;

describe("PUT /api/products/update/:id - Update Product", () => {
  let adminToken, masterToken, clientToken, productId;

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

    // Création d'un produit pour le test
    const product = await Product.create({
      name: "Test Product",
      description: "A product for testing",
      price: 9.99,
      category: CATEGORY.DRINK,
    });
    productId = product.id;
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

  // Ajoutez d'autres tests selon les besoins pour la validation des entrées, etc.

  afterAll(async () => {
    // Nettoyage : supprimez le produit créé pour le test
    if (productId) {
      await Product.destroy({ where: { id: productId } });
    }
  });
});
