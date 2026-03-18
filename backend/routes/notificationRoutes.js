// backend/routes/notificationRoutes.js
const express = require("express"); 
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

// Helper query
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
  });

// Get all notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

// Mark notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const result = await query(
      "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// Mark all notifications as read
router.put("/read-all", auth, async (req, res) => {
  try {
    await query(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// Delete notification
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// Get notification preferences
router.get("/preferences", auth, async (req, res) => {
  try {
    // This would typically come from a user_preferences table
    // For now, return default preferences
    res.json({
      email_notifications: true,
      order_updates: true,
      promotional_emails: false,
      seller_notifications: req.user.role === 'Seller'
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load preferences" });
  }
});

module.exports = router;