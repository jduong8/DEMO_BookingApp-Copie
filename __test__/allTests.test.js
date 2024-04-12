require("./authentication/signup.test.js");
require("./authentication/signin.test.js");
require("./user/getAllUsers.test.js");
require("./user/getUserInfo.test.js");
require("./user/updateUserInfo.test.js");
require("./user/updatePassword.test.js");
require("./user/updateUserRole.test.js");
require("./user/deleteUser.test.js");
require("./reservation/getReservations.test.js");
require("./reservation/addReservation.test.js");
require("./reservation/updateReservation.test.js");
require("./table/getAllTables.test.js");
require("./table/addNewTable.test.js");
require("./product/addNewProduct.test.js");
require("./product/getAllProducts.test.js");
require("./product/getOneProduct.test.js");
require("./product/updateProduct.test.js");
require("./product/deleteProduct.test.js");

module.exports = {
  testMatch: ["**/allTests.js"],
};
