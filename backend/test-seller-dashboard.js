const db = require('./config/db');

async function testSellerDashboard() {
  try {
    console.log('Testing seller dashboard fix...');
    
    // Check if there are any sellers in the database
    const [sellers] = await db.promise().query('SELECT * FROM sellers LIMIT 5');
    console.log('Sellers in database:', sellers.length);
    
    if (sellers.length > 0) {
      const seller = sellers[0];
      console.log('First seller:', seller);
      
      // Check if this seller has any products
      const [products] = await db.promise().query(
        'SELECT COUNT(*) AS count FROM products WHERE seller_id = ?',
        [seller.id]
      );
      console.log('Products for seller:', products[0].count);
      
      // Check if there are any order_items for this seller
      const [orderItems] = await db.promise().query(
        'SELECT COUNT(*) AS count FROM order_items WHERE seller_id = ?',
        [seller.id]
      );
      console.log('Order items for seller:', orderItems[0].count);
    }
    
    // Check users table
    const [users] = await db.promise().query('SELECT id, email, role FROM users WHERE role = "Seller" LIMIT 5');
    console.log('Seller users:', users.length);
    users.forEach(user => console.log(`User ID: ${user.id}, Email: ${user.email}`));
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    process.exit(0);
  }
}

testSellerDashboard();
