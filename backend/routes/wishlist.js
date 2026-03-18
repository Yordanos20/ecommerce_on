const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

// Helper for async queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// GET - Get current user's wishlist
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await query(
      `SELECT w.id as wishlist_id, p.id as product_id, p.name, p.price, p.image
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [userId]
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Add product to wishlist by productId
router.post("/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await query(
      `INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)`,
      [userId, productId]
    );

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Remove product from wishlist by productId
router.delete("/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await query(
      `DELETE FROM wishlists WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;