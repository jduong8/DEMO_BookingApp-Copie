const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
      user_role: {
        type: DataTypes.STRING,
        allowNull: true
       },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
       },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
       },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
       },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
       },
      user_password:{
        type: DataTypes.STRING,
        allowNull: false
       },
    }, {});

    return User;
  };