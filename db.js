require("dotenv").config();
const config = require("./config/config");

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  },
);
const db = {};

// Importation les modèles
db.user = require("./models/user.model.js")(sequelize);
db.place = require("./models/place.model.js")(sequelize);
db.reservation = require("./models/reservation.model.js")(sequelize);
db.product = require("./models/product.model.js")(sequelize);
db.order = require("./models/order.model.js")(sequelize);

// Définition des associations
db.user.hasMany(db.reservation, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});

db.place.hasMany(db.reservation, {
  onDelete: "CASCADE",
  foreignKey: "placeId",
});

// Synchronisation avec la base de données
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Les tables ont été créées !");
  })
  .catch((error) => {
    console.error("Erreur lors de la création des tables :", error);
  });

// try {
//   sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
//   })
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

module.exports = db;
