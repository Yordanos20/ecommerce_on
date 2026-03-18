const db = require('./config/db');

async function checkExistingData() {
  try {
    console.log('🔍 Checking existing data...');
    
    // Check products
    const [products] = await db.promise().query('SELECT COUNT(*) as count FROM products');
    console.log('📦 Total products:', products[0].count);
    
    // Check products for seller ID 1
    const [sellerProducts] = await db.promise().query('SELECT COUNT(*) as count FROM products WHERE seller_id = 1');
    console.log('📦 Products for seller ID 1:', sellerProducts[0].count);
    
    // Check orders
    const [orders] = await db.promise().query('SELECT COUNT(*) as count FROM orders');
    console.log('📋 Total orders:', orders[0].count);
    
    // Check order items for seller
    const [sellerOrderItems] = await db.promise().query('SELECT COUNT(*) as count FROM order_items WHERE seller_id = 1');
    console.log('📋 Order items for seller ID 1:', sellerOrderItems[0].count);
    
    // Show some sample products
    const [sampleProducts] = await db.promise().query('SELECT id, name, seller_id FROM products LIMIT 5');
    console.log('📦 Sample products:');
    sampleProducts.forEach(p => console.log(`  - ID: ${p.id}, Name: ${p.name}, Seller: ${p.seller_id}`));
    
    // Show sample orders
    const [sampleOrders] = await db.promise().query('SELECT id, user_id, total_price, status FROM orders LIMIT 5');
    console.log('📋 Sample orders:');
    sampleOrders.forEach(o => console.log(`  - ID: ${o.id}, User: ${o.user_id}, Total: ${o.total_price}, Status: ${o.status}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkExistingData();
