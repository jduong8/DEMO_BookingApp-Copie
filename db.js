const config = require("./config/config");
const environment = process.env.NODE_ENV;
const dbConfig = config[environment];
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
  },
);

const db = {};

// Importation les modèles
db.User = require("./models/user.model.js")(sequelize, DataTypes);
db.Table = require("./models/table.model.js")(sequelize, DataTypes);
db.Reservation = require("./models/reservation.model.js")(sequelize, DataTypes);
db.Product = require("./models/product.model.js")(sequelize, DataTypes);
db.Order = require("./models/order.model.js")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    if (environment === "development") {
      await sequelize.sync({ force: true });
      console.log("Les tables ont été créées !");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

initializeDatabase();

module.exports = db;
