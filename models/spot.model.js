module.exports = (sequelize) => {
  const Spot = sequelize.define("Spot", {}, {});

  return Spot;
};
