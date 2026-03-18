// backend/models/Notification.js

const db = require("../config/db");

const Notification = {

  // Create notification
  create: (user_id, message, link = "") => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO notifications (user_id, message, link)
        VALUES (?, ?, ?)
      `;

      db.query(sql, [user_id, message, link], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get notifications for a user
  getByUser: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;

      db.query(sql, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Mark notification as read
  markAsRead: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE id = ?
      `;

      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete notification
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM notifications
        WHERE id = ?
      `;

      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

};

module.exports = Notification;