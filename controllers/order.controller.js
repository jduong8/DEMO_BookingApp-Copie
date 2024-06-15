const OrderService = require("../services/order.service");
const orderService = new OrderService();

exports.getAllOrder = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.send(orders);
  } catch (error) {
    console.error("Cannot find orders", error);
    next(error);
  }
};

exports.getOrderDetailForTable = async (req, res) => {
  try {
    const order = await orderService.getOrderDetailByTable(
      req.params.orderId,
      req.params.tabldId,
    );
    res.send(order);
  } catch {
    res.status(404).json({ message: "Order not found" });
  }
};

exports.getAllOrderForTable = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrdersByTable(req.params.tableId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json({ message: "Order updated successfully.", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = await orderService.deleteOrder(req.params.id);
    res
      .status(200)
      .json({ message: "Order deleted successfully.", id: orderId });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
