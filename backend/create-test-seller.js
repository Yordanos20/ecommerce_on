const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createTestSeller() {
  try {
    console.log('Creating test seller...');
    
    // First create a user with seller role
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [userResult] = await db.promise().query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Test Seller', 'seller@test.com', hashedPassword, 'Seller']
    );
    
    const userId = userResult.insertId;
    console.log('Created user with ID:', userId);
    
    // Then create a seller record
    const [sellerResult] = await db.promise().query(
      'INSERT INTO sellers (user_id, store_name, store_description, approval_status) VALUES (?, ?, ?, ?)',
      [userId, 'Test Store', 'A test store for debugging', 'Approved']
    );
    
    const sellerId = sellerResult.insertId;
    console.log('Created seller with ID:', sellerId);
    
    // Add some test products for this seller
    const [productResult] = await db.promise().query(
      `INSERT INTO products (name, description, price, stock, seller_id, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Test Product 1', 'A test product', 29.99, 100, sellerId, 1]
    );
    
    console.log('Created test product with ID:', productResult.insertId);
    
    console.log('Test seller created successfully!');
    console.log('Login credentials: seller@test.com / password123');
    
  } catch (error) {
    console.error('Error creating test seller:', error);
  } finally {
    process.exit(0);
  }
}

createTestSeller();
