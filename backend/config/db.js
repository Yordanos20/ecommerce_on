// backend/config/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool for Railway MySQL with SSL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 20000,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ MySQL connected successfully");
    connection.release();
  }
});

// Export pool
module.exports = pool;