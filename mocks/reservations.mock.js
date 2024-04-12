const RESERVATION_STATUS = require("../models/reservationStatus.model.js");

const createReservationMock = async () => {
  const reservations = [
    {
      number_of_customers: 4,
      date: new Date(2024, 1, 14),
      time: "12:30",
      name: "Bob Johnson",
      description: "Table près de la fenêtre, si possible.",
      status: RESERVATION_STATUS.CONFIRMED,
      userId: 2,
    },
    {
      number_of_customers: 2,
      date: new Date(2024, 1, 15),
      time: "13:30",
      name: "Carol Williams",
      description: "Table tranquille.",
      status: RESERVATION_STATUS.PENDING,
      userId: 3,
    },
    {
      number_of_customers: 8,
      date: new Date(2024, 1, 14),
      time: "19:30",
      name: "Alice Smith",
      description: "Anniversaire et avec siege enfant",
      status: RESERVATION_STATUS.PENDING,
      userId: 1,
    },
    {
      number_of_customers: 6,
      date: new Date(2024, 1, 15),
      time: "20:00",
      name: "David Brown",
      description: "Table ronde si possible",
      status: RESERVATION_STATUS.PENDING,
      userId: 4,
    },
  ];

  return reservations;
};

module.exports = createReservationMock;
