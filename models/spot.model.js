const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Spot = sequelize.define('Spot', {

    }, {});

    return Spot;
  };