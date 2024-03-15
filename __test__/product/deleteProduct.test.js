const request = require("supertest");
const app = require("../../app.js");
const Product = require("../../db.js").product;
const CATEGORY = require("../../models/category.model.js");

describe("DELETE /api/products/delete/:id - Delete Product", () => {
  let masterToken, adminToken, clientToken, productToDeleteId;

  beforeAll(async () => {
    // Créer un produit pour le test
    const product = await Product.create({
      name: "Product to Delete",
      description: "This product will be deleted",
      price: 19.99,
      category: CATEGORY.DESSERT,
    });
    productToDeleteId = product.id;

    const master = await request(app).post("/api/signin").send({
      email: "master@example.com",
      user_password: "master12345678",
    });
    masterToken = master.body.token;

    const admin = await request(app).post("/api/signin").send({
      email: "superman@example.com",
      user_password: "clark12345678",
    });
    adminToken = admin.body.token;

    const client = await request(app).post("/api/signin").send({
      email: "alice@example.com",
      user_password: "alice12345678",
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
    // Tentez de supprimer à nouveau le même produit, ce qui devrait échouer puisqu'il n'existe plus
    await request(app)
      .delete(`/api/products/delete/${productToDeleteId}`)
      .set("Authorization", `${adminToken}`)
      .expect(404);
  });
});
