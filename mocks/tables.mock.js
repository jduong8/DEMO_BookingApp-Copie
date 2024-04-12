const createTableMock = async () => {
  let data = [];

  const tableConfigurations = [
    { seatCount: 2, tableCount: 4 },
    { seatCount: 4, tableCount: 3 },
    { seatCount: 6, tableCount: 2 },
    { seatCount: 8, tableCount: 1 },
  ];

  tableConfigurations.forEach((config) => {
    for (let i = 0; i < config.tableCount; i++) {
      data.push({
        seats_count: config.seatCount,
        is_available: true,
        has_seated_guests: false,
      });
    }
  });

  return data;
};

module.exports = createTableMock;
