const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function checkAndCreateSellerData() {
  try {
    console.log('🔍 Checking seller data...');
    
    // Check if seller users exist
    const [sellers] = await db.promise().query(
      'SELECT id, name, email, role FROM users WHERE LOWER(role) = "seller"'
    );
    
    console.log(`Found ${sellers.length} seller users`);
    
    if (sellers.length === 0) {
      console.log('📝 Creating test seller user...');
      
      // Create seller user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [userResult] = await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Test Seller', 'seller@test.com', hashedPassword, 'Seller']
      );
      
      const userId = userResult.insertId;
      console.log(`✅ Created seller user with ID: ${userId}`);
      
      // Create seller record
      const [sellerResult] = await db.promise().query(
        'INSERT INTO sellers (user_id, store_name, approval_status) VALUES (?, ?, ?)',
        [userId, 'Test Store', 'Approved']
      );
      
      const sellerId = sellerResult.insertId;
      console.log(`✅ Created seller record with ID: ${sellerId}`);
      
      // Create some test products
      for (let i = 1; i <= 5; i++) {
        await db.promise().query(
          `INSERT INTO products (name, description, price, stock, seller_id, is_approved) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [`Test Product ${i}`, `Description for test product ${i}`, 29.99 * i, 100 - i * 10, sellerId, 1]
        );
      }
      
      console.log('✅ Created 5 test products');
      
      // Create some test orders
      for (let i = 1; i <= 3; i++) {
        const [orderResult] = await db.promise().query(
          'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
          [1, 99.99 * i, 'Pending']
        );
        
        const orderId = orderResult.insertId;
        
        // Add order items for this seller
        await db.promise().query(
          'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
          [orderId, i, sellerId, 1, 29.99 * i]
        );
      }
      
      console.log('✅ Created 3 test orders');
      
    } else {
      console.log('✅ Seller users already exist');
      sellers.forEach(seller => {
        console.log(`  - ${seller.name} (${seller.email})`);
      });
      
      // Check seller products
      const [products] = await db.promise().query('SELECT COUNT(*) as count FROM products');
      console.log(`📦 Total products in database: ${products[0].count}`);
      
      // Check orders
      const [orders] = await db.promise().query('SELECT COUNT(*) as count FROM orders');
      console.log(`📋 Total orders in database: ${orders[0].count}`);
    }
    
    console.log('\n🎉 Seller data check completed!');
    console.log('📧 Login credentials: seller@test.com / password123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAndCreateSellerData();
