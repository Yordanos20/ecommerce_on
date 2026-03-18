// backend/routes/customer.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
  });

// Get customer dashboard data
router.get("/dashboard", auth, async (req, res) => {
  try {
    const customerId = req.user.id;
    
    // Get customer's orders
    const orders = await query(
      `SELECT o.id, o.total_price, o.status, o.created_at,
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.id, o.total_price, o.status, o.created_at
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [customerId]
    );

    // Get customer's addresses
    const addresses = await query(
      `SELECT id, address, city, state, zip, country, phone, email,
              CASE WHEN is_default = 1 THEN 'Home' ELSE 'Shipping' END as type
       FROM shipping
       WHERE order_id IN (
         SELECT id FROM orders WHERE customer_id = ?
       )
       GROUP BY id, address, city, state, zip, country, phone, email, is_default
       LIMIT 3`,
      [customerId]
    );

    // Get customer's notifications
    const notifications = await query(
      `SELECT id, title, message, type, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [customerId]
    );

    // Get customer's wishlist items
    const wishlistItems = await query(
      `SELECT w.id, w.product_id, w.created_at,
              p.name, p.price, p.image
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC
       LIMIT 5`,
      [customerId]
    );

    // Get customer stats
    const stats = await query(
      `SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_price), 0) as total_spent,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as completed_orders
       FROM orders o
       WHERE o.customer_id = ?`,
      [customerId]
    );

    res.json({
      orders: orders,
      addresses: addresses,
      notifications: notifications,
      wishlistItems: wishlistItems,
      stats: stats[0] || {
        total_orders: 0,
        total_spent: 0,
        pending_orders: 0,
        completed_orders: 0
      }
    });
  } catch (err) {
    console.error("Customer dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get customer orders
router.get("/orders", auth, async (req, res) => {
  try {
    const customerId = req.user.id;
    
    const orders = await query(
      `SELECT o.id, o.total_price, o.status, o.created_at,
              COUNT(oi.id) as item_count,
              GROUP_CONCAT(p.name SEPARATOR ', ') as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.customer_id = ?
       GROUP BY o.id, o.total_price, o.status, o.created_at
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customer profile
router.get("/profile", auth, async (req, res) => {
  try {
    const customerId = req.user.id;
    
    const profile = await query(
      `SELECT id, name, email, phone, created_at
       FROM users
       WHERE id = ?`,
      [customerId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(profile[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
