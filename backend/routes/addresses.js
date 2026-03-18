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

// Get all addresses for a user
router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(userId) !== Number(req.user.id) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const results = await query("SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new address
router.post("/", auth, async (req, res) => {
  try {
    const { userId, label, street, city, state, zip, country, instructions } = req.body;

    if (Number(userId) !== Number(req.user.id) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const result = await query(
      `INSERT INTO addresses (user_id, label, street, city, state, zip, country, instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, label || "", street || "", city || "", state || "", zip || "", country || "", instructions || ""]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update address
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, street, city, state, zip, country, instructions } = req.body;

    const rows = await query("SELECT user_id FROM addresses WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Address not found" });

    if (Number(rows[0].user_id) !== Number(req.user.id) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query(
      `UPDATE addresses
       SET label = ?, street = ?, city = ?, state = ?, zip = ?, country = ?, instructions = ?
       WHERE id = ?`,
      [label || "", street || "", city || "", state || "", zip || "", country || "", instructions || "", id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete address
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await query("SELECT user_id FROM addresses WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Address not found" });

    if (Number(rows[0].user_id) !== Number(req.user.id) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query("DELETE FROM addresses WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
