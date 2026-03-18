// backend/fixNotificationsTable.js
const mysql = require("mysql2");
require("dotenv").config();

// Create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "161920",
  database: process.env.DB_NAME || "ecommerce",
});

// Check existing table structure
connection.query("DESCRIBE notifications", (err, result) => {
  if (err) {
    console.error("❌ Error checking table structure:", err);
    connection.end();
    return;
  }
  
  console.log("Current table structure:", result);
  
  // Drop and recreate table with correct structure
  connection.query("DROP TABLE IF EXISTS notifications", (err) => {
    if (err) {
      console.error("❌ Error dropping table:", err);
      connection.end();
      return;
    }
    
    // Create notifications table with correct structure
    const createNotificationsTable = `
      CREATE TABLE notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type ENUM('order', 'user', 'product', 'system') DEFAULT 'system',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        is_read BOOLEAN DEFAULT FALSE,
        related_id INT NULL,
        related_type VARCHAR(50) NULL,
        action_required BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_is_read (is_read),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    
    connection.query(createNotificationsTable, (err, result) => {
      if (err) {
        console.error("❌ Error creating notifications table:", err);
      } else {
        console.log("✅ Notifications table created successfully with correct structure");
        
        // Insert sample data
        const insertSampleNotifications = `
          INSERT INTO notifications (user_id, title, message, type, priority, related_id, related_type) VALUES
          (1, 'New Order Received', 'A new order #1234 has been placed', 'order', 'high', 1234, 'order'),
          (1, 'Product Approval', 'Your product "Wireless Headphones" has been approved', 'product', 'medium', 567, 'product'),
          (1, 'System Update', 'Admin panel has been updated with new features', 'system', 'low', NULL, NULL),
          (1, 'User Registration', 'New user John Doe has registered on the platform', 'user', 'medium', 89, 'user')
        `;
        
        connection.query(insertSampleNotifications, (err, result) => {
          if (err) {
            console.error("❌ Error inserting sample notifications:", err);
          } else {
            console.log("✅ Sample notifications inserted successfully");
          }
          
          connection.end();
        });
      }
    });
  });
});
