const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        number_of_customers: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reservation_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reservation_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reservation_note: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reservation_status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
     }, {});
    return Reservation
};