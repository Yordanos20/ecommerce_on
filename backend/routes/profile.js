const express = require("express");
const router = express.Router();
const db = require("../db");

// ==================== ADDRESSES ====================

// Get all addresses for a user
router.get("/addresses", async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await db.query("SELECT * FROM addresses WHERE userId = ?", [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Add new address
router.post("/addresses", async (req, res) => {
  const { userId, label, street, city, state, zip, country, instructions } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO addresses (userId, label, street, city, state, zip, country, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, label, street, city, state, zip, country, instructions]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add address" });
  }
});

// Update address
router.put("/addresses/:id", async (req, res) => {
  const { id } = req.params;
  const { label, street, city, state, zip, country, instructions } = req.body;
  try {
    await db.query(
      "UPDATE addresses SET label=?, street=?, city=?, state=?, zip=?, country=?, instructions=? WHERE id=?",
      [label, street, city, state, zip, country, instructions, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Delete address
router.delete("/addresses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM addresses WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// ==================== PAYMENTS ====================

// Get all payments for a user
router.get("/payments", async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await db.query("SELECT * FROM payments WHERE userId = ?", [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Add new payment
router.post("/payments", async (req, res) => {
  const { userId, type, last4, nickname } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO payments (userId, type, last4, nickname) VALUES (?, ?, ?, ?)",
      [userId, type, last4, nickname]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add payment" });
  }
});

// Update payment
router.put("/payments/:id", async (req, res) => {
  const { id } = req.params;
  const { type, last4, nickname } = req.body;
  try {
    await db.query(
      "UPDATE payments SET type=?, last4=?, nickname=? WHERE id=?",
      [type, last4, nickname, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment" });
  }
});

// Delete payment
router.delete("/payments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM payments WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

module.exports = router;