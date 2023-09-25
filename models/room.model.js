const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Room = sequelize.define('Room', {

    }, {});

    return Room;
  };