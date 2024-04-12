module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define(
    "Table",
    {
      seats_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      has_seated_guests: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {},
  );

  Table.associate = (models) => {
    Table.hasMany(models.Reservation, {
      onDelete: "CASCADE",
      foreignKey: "tableId",
      as: "reservation",
    });
    Table.hasMany(models.Order, {
      onDelete: "CASCADE",
      foreignKey: "tableId",
      as: "order",
    });
  };

  return Table;
};
