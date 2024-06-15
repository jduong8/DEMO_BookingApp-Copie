const db = require("../db.js");
const Order = db.Order;
const TableService = require("./table.service");

class OrderService {
  constructor() {
    this.tableService = new TableService();
  }

  async getAllOrders() {
    const orders = await Order.findAll({
      include: [{ model: db.Product, as: "product" }],
    });

    if (!orders) return [];

    return orders;
  }

  async getOrderDetailByTable(id, tableId) {
    const order = await Order.findOne({
      where: { id, tableId },
      include: [{ model: db.Product, as: "product" }],
    });

    if (!order) throw new Error("Order not found");

    return order;
  }

  async getAllOrdersByTable(tableId) {
    const orders = await Order.findAll({
      where: { tableId },
      include: [{ model: db.Product, as: "product" }],
    });
    if (!orders) return [];
    return orders;
  }

  async createOrder({ productId, tableId, quantity }) {
    if (!productId || !tableId || !quantity) {
      throw new Error(
        "Missing information. Product ID, Table ID, and quantity are required.",
      );
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      throw new Error("Invalid quantity. It must be a positive integer.");
    }

    const table = await this.tableService.getTableById(tableId); // Use TableService to get the table
    if (!table) throw new Error("Table not found.");
    if (!table.has_seated_guests)
      throw new Error("Cannot create order. The table has no seated guests.");

    return await Order.create({ productId, tableId, quantity });
  }

  async updateOrder(id, { productId, tableId, quantity }) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error("Order not found.");
    if (!productId || !tableId || !quantity) {
      throw new Error(
        "Missing information. Product ID, Table ID, and quantity are required.",
      );
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      throw new Error("Invalid quantity. It must be a positive integer.");
    }

    await order.update({ productId, tableId, quantity });
    return order;
  }

  async deleteOrder(id) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error("Order not found.");
    await order.destroy();
    return id;
  }
}

module.exports = OrderService;
