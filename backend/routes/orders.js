// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");
const roleCheck = require("../config/middleware/role");
const {
  createOrder,
  getOrders,
  getPendingOrders,
  getRevenueStats,
} = require("../controllers/orderControllers");

// POST - Place order (customer)
router.post("/", auth, createOrder);

// GET - Orders (role-based: customer sees own, seller sees theirs, admin sees all)
router.get("/", auth, getOrders);

// GET - Pending orders (seller/admin)
router.get("/pending", auth, roleCheck(["Seller", "Admin"]), getPendingOrders);

// GET - Revenue stats
router.get("/revenue", auth, roleCheck(["Seller", "Admin"]), getRevenueStats);

// GET - Single order details
router.get("/:id", auth, async (req, res) => {
  const db = require("../config/db");
  const query = (sql, values = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
    });

  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const role = String(req.user.role || "").toLowerCase();

    let orders;
    if (role === "admin") {
      orders = await query(
        `SELECT o.*, u.name AS customer_name, u.email AS customer_email
         FROM orders o JOIN users u ON o.customer_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );
    } else {
      orders = await query(
        `SELECT o.*, u.name AS customer_name
         FROM orders o JOIN users u ON o.customer_id = u.id
         WHERE o.id = ? AND o.customer_id = ?`,
        [orderId, userId]
      );
    }

    if (orders.length === 0) return res.status(404).json({ error: "Order not found" });

    const items = await query(
      `SELECT oi.*, p.name, p.image, s.store_name as seller_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN sellers s ON oi.seller_id = s.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const shipping = await query(
      "SELECT * FROM shipping WHERE order_id = ?",
      [orderId]
    );

    const payment = await query(
      "SELECT * FROM payments WHERE order_id = ?",
      [orderId]
    );

    res.json({
      ...orders[0],
      items,
      shipping: shipping[0] || null,
      payment: payment[0] || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update order status (admin)
router.put("/:id/status", auth, roleCheck(["Admin"]), async (req, res) => {
  const db = require("../config/db");
  const query = (sql, values = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
    });

  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);

    // Create notification for customer
    const order = await query("SELECT customer_id FROM orders WHERE id = ?", [req.params.id]);
    if (order.length > 0) {
      await query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [order[0].customer_id, 'Order Update', `Your order #${req.params.id} status has been updated to ${status}`, 'order']
      );
    }

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Cancel order (customer)
router.post("/:id/cancel", auth, async (req, res) => {
  const db = require("../config/db");
  const query = (sql, values = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
    });

  try {
    const order = await query(
      "SELECT * FROM orders WHERE id = ? AND customer_id = ?",
      [req.params.id, req.user.id]
    );

    if (order.length === 0) return res.status(404).json({ error: "Order not found" });
    if (!['Pending', 'Confirmed'].includes(order[0].status)) {
      return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    }

    await query("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [req.params.id]);

    // Restore stock
    const items = await query("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [req.params.id]);
    for (const item of items) {
      await query("UPDATE products SET stock = stock + ? WHERE id = ?", [item.quantity, item.product_id]);
    }

    res.json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;