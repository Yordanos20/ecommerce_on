// backend/routes/payments.js
const express = require("express");
const db = require("../config/db");
const auth = require("../config/middleware/auth");
const router = express.Router();

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// ================= CREATE PAYMENT (mock simulation) =================
router.post("/", auth, async (req, res) => {
  try {
    const { order_id, payment_method, amount } = req.body;

    if (!order_id || !payment_method || amount == null) {
      return res.status(400).json({ error: "order_id, payment_method and amount are required" });
    }

    const orders = await query("SELECT id, customer_id FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) return res.status(404).json({ error: "Order not found" });

    const role = String(req.user.role || "").toLowerCase();
    if (role !== "admin" && Number(orders[0].customer_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const result = await query(
      `INSERT INTO payments (order_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, 'Pending')`,
      [order_id, amount, payment_method]
    );

    res.status(201).json({
      success: true,
      paymentId: result.insertId,
      status: "Pending",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CONFIRM PAYMENT SUCCESS =================
router.put("/success/:paymentId", auth, async (req, res) => {
  try {
    const { paymentId } = req.params;

    await query("UPDATE payments SET payment_status = 'Completed' WHERE id = ?", [paymentId]);

    const rows = await query("SELECT order_id FROM payments WHERE id = ?", [paymentId]);
    if (rows.length === 0) return res.status(404).json({ error: "Payment not found" });

    await query("UPDATE orders SET status = 'Processing' WHERE id = ?", [rows[0].order_id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= MARK PAYMENT AS FAILED =================
router.put("/failed/:paymentId", auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    await query("UPDATE payments SET payment_status = 'Failed' WHERE id = ?", [paymentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET ALL PAYMENTS FOR A CUSTOMER =================
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const role = String(req.user.role || "").toLowerCase();

    if (role !== "admin" && Number(req.user.id) !== Number(userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const results = await query(
      `SELECT p.*, o.customer_id
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE o.customer_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET ALL PAYMENTS FOR A SELLER =================
router.get("/seller/:sellerId", auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const role = String(req.user.role || "").toLowerCase();

    // Only allow the seller themselves or admin
    if (role !== "admin" && Number(req.user.id) !== Number(sellerId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const results = await query(
      `SELECT p.*, o.seller_id
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE o.seller_id = ?
       ORDER BY p.created_at DESC`,
      [sellerId]
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;