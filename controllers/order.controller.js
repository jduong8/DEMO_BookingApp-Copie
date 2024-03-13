const db = require("../db.js");
const Order = db.order;
const Table = db.table;
const USER_ROLE = require("../models/userRole.model.js");

// Méthode pour récupérer toutes les commandes
exports.getAllOrder = async (req, res, next) => {
  try {
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins can read orders.",
      });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: db.product,
          as: "product",
        },
      ],
    });

    res.send(orders);
  } catch (error) {
    console.error("Cannot find order", error);
    next(error);
  }
};

// Méthode pour récupérer toutes les commandes d'une table
exports.getAllOrderForTable = async (req, res, next) => {
  const { tableId } = req.params;

  try {
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins can read orders for a table.",
      });
    }

    const orders = await Order.findAll({
      where: {
        tableId: tableId,
      },
      include: [
        {
          model: db.product,
          as: "product",
        },
      ],
    });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No orders found for this table." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Cannot find orders for table", error);
    next(error);
  }
};

// Méthode pour créer de nouvelle commande
exports.createOrder = async (req, res, next) => {
  const { productId, tableId, quantity } = req.body;

  try {
    // Vérification des rôles utilisateur
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins can create orders.",
      });
    }

    // Vérification de la présence des champs requis
    if (!productId || !tableId || !quantity) {
      return res.status(400).json({
        message:
          "Missing information. Product ID, Table ID, and quantity are required.",
      });
    }

    // Vérification que la quantité est un entier positif
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity. It must be a positive integer.",
      });
    }

    // Récupération de la table associée pour vérifier si elle a des invités
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    // Si la table n'a pas de clients assis, rejeter la création de la commande
    if (!table.has_seated_guests) {
      return res.status(403).json({
        message: "Cannot create order. The table has no seated guests.",
      });
    }

    // Création de la commande après validation des données
    const order = await Order.create({
      productId,
      tableId,
      quantity,
    });

    res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    next(error);
  }
};

// Méthode pour modifier une commande via son ID
exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { productId, tableId, quantity } = req.body;

  try {
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins can update orders.",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (!productId || !tableId || !quantity) {
      return res.status(400).json({
        message:
          "Missing information. Product ID, Table ID, and quantity are required.",
      });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity. It must be a positive integer.",
      });
    }

    await order.update({
      productId,
      tableId,
      quantity,
    });

    res.status(200).json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Order update error:", error);
    next(error);
  }
};

// Méthode pour supprimer une commande via son ID
exports.deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (
      req.user.user_role !== USER_ROLE.ADMIN &&
      req.user.user_role !== USER_ROLE.MASTER
    ) {
      return res.status(403).json({
        message: "Access denied. Only admins can delete orders.",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    await order.destroy();

    res.status(200).json({
      message: "Order deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("Order deletion error:", error);
    next(error);
  }
};
