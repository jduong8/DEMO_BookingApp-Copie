exports.validateProductDetails = (name, description, price, category) => {
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    isNaN(parseFloat(price)) ||
    !isFinite(price)
  ) {
    throw new Error(
      "Invalid input: Ensure name, description, category are strings and price is a valid number.",
    );
  }
};

exports.formatProductPrice = (product) => {
  let productData = product.toJSON();
  productData.price = `${productData.price.toFixed(2).replace(".", ",")} €`;
  return productData;
};
