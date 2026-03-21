const db = require("../config/db");

// Create users table if it doesn't exist
const createUsersTable = async () => {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Customer', 'Seller', 'Admin') DEFAULT 'Customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await new Promise((resolve, reject) => {
      db.query(createTableSQL, (err, result) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        } else {
          console.log('Users table created or already exists');
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Create sellers table if it doesn't exist
const createSellersTable = async () => {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sellers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        store_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    
    await new Promise((resolve, reject) => {
      db.query(createTableSQL, (err, result) => {
        if (err) {
          console.error('Error creating sellers table:', err);
          reject(err);
        } else {
          console.log('Sellers table created or already exists');
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Insert test seller user
const insertTestSeller = async () => {
  try {
    const bcrypt = require('bcrypt');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // Insert seller user
    const insertSQL = `
      INSERT INTO users (name, email, password, role) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name = VALUES(name), 
      password = VALUES(password)
    `;
    
    await new Promise((resolve, reject) => {
      db.query(insertSQL, ['Test Seller', 'seller@gmail.com', hashedPassword, 'Seller'], (err, result) => {
        if (err) {
          console.error('Error inserting test seller:', err);
          reject(err);
        } else {
          console.log('Test seller inserted/updated with ID:', result.insertId || result.affectedRows);
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Initialize database
const initDatabase = async () => {
  console.log('🔧 Initializing database...');
  
  try {
    await createUsersTable();
    await createSellersTable();
    await insertTestSeller();
    
    console.log('✅ Database initialization complete!');
    console.log('🎯 Test seller user created:');
    console.log('   Email: seller@gmail.com');
    console.log('   Password: 123456');
    console.log('   Role: Seller');
    console.log('');
    console.log('🚀 You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
  
  process.exit(0);
};

// Run initialization
initDatabase();
