const db = require("../db.js");
const Product = db.product;

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    // Formater chaque prix des produits pour l'affichage
    const formattedProducts = products.map((product) => {
      let formattedProduct = product.toJSON(); // Convertie en JSON
      formattedProduct.price = `${formattedProduct.price.toFixed(2).replace(".", ",")} €`;
      return formattedProduct;
    });
    res.send(formattedProducts);
  } catch (error) {
    next(error);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    // Récupérer l'identifiant du produit depuis les paramètres de la requête
    const { id } = req.params;

    // Recherche le produit dans la base de données à l'aide de l'ID
    const product = await Product.findByPk(id);

    // Si le produit n'existe pas, on renvoie une erreur 404
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Formater le prix du produit pour l'affichage
    let formattedProduct = product.toJSON(); // Convertir en JSON
    formattedProduct.price = `${formattedProduct.price.toFixed(2).replace(".", ",")} €`;

    // Sinon, on renvoie les détails du produit
    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product details:", error);
    next(error);
  }
};

exports.addNewProduct = async (req, res, next) => {
  const { name, description, price, category } = req.body;

  try {
    // Vérification que name, description et category sont des chaînes de caractères
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string"
    ) {
      return res.status(400).json({
        message:
          "Invalid input: name, description, and category must be strings.",
      });
    }

    // Vérification que price est un double
    if (isNaN(parseFloat(price)) || !isFinite(price)) {
      return res.status(400).json({
        message: "Invalid input: price must be a number.",
      });
    }

    // Création du produit après validation des données
    const product = await Product.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).send(product);
  } catch (error) {
    console.error("Product creation error:", error);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant du produit depuis les paramètres de la requête
  const { name, description, price, category } = req.body;

  try {
    // Recherche du produit à mettre à jour
    const product = await Product.findByPk(id);

    // Si le produit n'existe pas, renvoie une erreur 404
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Vérification que name, description, price et category sont valides
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      isNaN(parseFloat(price)) ||
      !isFinite(price)
    ) {
      return res.status(400).json({
        message:
          "Invalid input: Ensure name, description, and category are strings and price is a valid number.",
      });
    }

    // Mise à jour du produit
    await product.update({
      name,
      description,
      price,
      category,
    });

    // Renvoyer les informations du produit mis à jour
    let updatedProduct = product.toJSON();
    updatedProduct.price = `${updatedProduct.price.toFixed(2).replace(".", ",")} €`;
    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Product update error:", error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params; // Récupération de l'identifiant du produit depuis les paramètres de la requête

  try {
    // Recherche du produit à supprimer
    const product = await Product.findByPk(id);

    // Si le produit n'existe pas, renvoie une erreur 404
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    // Conserver les données du produit pour la réponse
    let productDetails = product.toJSON(); // Convertir en JSON
    productDetails.price = `${productDetails.price.toFixed(2).replace(".", ",")} €`;

    // Suppression du produit
    await product.destroy();

    // Réponse indiquant que la suppression a été effectuée avec succès et renvoie les détails du produit supprimé
    res.status(200).json({
      message: "Product deleted successfully.",
      product: productDetails,
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    next(error);
  }
};
