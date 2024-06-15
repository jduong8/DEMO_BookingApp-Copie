const db = require("../db.js");
const Table = db.Table;

class TableService {
  async getAllTables() {
    const tables = await Table.findAll();
    if (!tables) return [];
    return tables;
  }

  async getOneTable(id) {
    const table = await Table.findByPk(id);
    if (!table) throw new Error("Table not found");

    return table;
  }

  async addNewTable(seats_count) {
    if (!Number.isInteger(seats_count) || seats_count <= 0) {
      throw new Error("Invalid seats_count. Must be a positive integer.");
    }

    return await Table.create({
      seats_count,
      is_available: true,
      has_seated_guests: false,
    });
  }

  async updateSeatsCount(id, seats_count) {
    const table = await Table.findByPk(id);
    if (!table) {
      throw new Error("Table not found.");
    }

    if (
      seats_count !== undefined &&
      (!Number.isInteger(seats_count) || seats_count <= 0)
    ) {
      throw new Error("Invalid seats_count. Must be a positive integer.");
    }

    return await table.update({
      seats_count: seats_count !== undefined ? seats_count : table.seats_count,
    });
  }

  async updateSeatedGuestsStatus(id, isAvailable, hasSeatedGuests) {
    const table = await Table.findByPk(id);
    if (!table) {
      throw new Error("Table not found.");
    }

    return await table.update({
      is_available: isAvailable,
      has_seated_guests: hasSeatedGuests,
    });
  }

  async findAvailableTable(seatsCount) {
    return await Table.findOne({
      where: {
        seats_count: seatsCount,
        is_available: true,
      },
    });
  }

  async markTableAsUnavailable(tableId) {
    const table = await Table.findByPk(tableId);
    if (!table) {
      throw new Error("Table not found.");
    }
    return await table.update({ is_available: false });
  }

  async deleteTable(id) {
    const table = await Table.findByPk(id);
    if (!table) {
      throw new Error("Table not found.");
    }

    await table.destroy();
  }
}

module.exports = TableService;
