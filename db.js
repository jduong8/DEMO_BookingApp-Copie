require('dotenv').config();
const userDefault = process.env.DB_USERDEFAULT;
const dbPassword = process.env.DB_PASSWORD;

const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('postgres://postgres:0123456789@127.0.0.1:5432/db_development')
const sequelize = new Sequelize(`postgres://${userDefault}:${dbPassword}@tai.db.elephantsql.com/${userDefault}`);
const db = {};

// Importer les modèles
db.user = require('./models/user.model.js')(sequelize);
db.spot = require('./models/spot.model.js')(sequelize);
db.room = require('./models/room.model.js')(sequelize);
db.reservation = require('./models/reservation.model.js')(sequelize);

// Synchronisation avec la base de données
sequelize.sync({ force: true })
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