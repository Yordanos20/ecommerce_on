// backend/routes/support.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

// Helper function to run queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)))
  );

// GET all tickets for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tickets = await query(
      "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load support tickets" });
  }
});

// POST a new support ticket
router.post("/", auth, async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message)
    return res.status(400).json({ error: "Subject and message are required" });

  try {
    const result = await query(
      "INSERT INTO support_tickets (user_id, subject, message, status) VALUES (?, ?, ?, 'Pending')",
      [req.user.id, subject, message]
    );

    // Return the newly created ticket
    const ticket = await query("SELECT * FROM support_tickets WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(ticket[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create support ticket" });
  }
});

module.exports = router;