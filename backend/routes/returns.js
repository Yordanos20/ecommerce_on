const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// GET - Customer's returns (frontend calls GET /api/returns)
router.get("/", auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const role = (req.user.role || "").toLowerCase();

    if (role === "admin") {
      const returns = await query(
        "SELECT r.*, o.customer_id FROM returns r JOIN orders o ON r.order_id = o.id ORDER BY r.created_at DESC"
      );
      return res.json(returns);
    }

    const returns = await query(
      "SELECT r.* FROM returns r JOIN orders o ON r.order_id = o.id WHERE o.customer_id = ? ORDER BY r.created_at DESC",
      [user_id]
    );
    res.json(returns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Request return (frontend calls POST /api/returns with {order_id, reason})
router.post("/", auth, async (req, res) => {
  try {
    const { order_id, reason } = req.body;
    const user_id = req.user.id;

    if (!order_id) return res.status(400).json({ error: "Order ID required" });

    const orderCheck = await query("SELECT id FROM orders WHERE id = ? AND customer_id = ?", [
      order_id,
      user_id,
    ]);
    if (orderCheck.length === 0) return res.status(404).json({ error: "Order not found" });

    await query("INSERT INTO returns (order_id, reason) VALUES (?, ?)", [order_id, reason || ""]);
    res.status(201).json({ message: "Return requested ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update return status (admin approve/reject)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query("UPDATE returns SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Return not found" });
    res.json({ message: "Return updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
