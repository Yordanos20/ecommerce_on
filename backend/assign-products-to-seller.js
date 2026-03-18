const db = require('./config/db');

async function assignProductsToSeller() {
  try {
    console.log('🔧 Assigning products to seller...');
    
    // Get first 8 products and assign them to seller ID 1
    const [products] = await db.promise().query('SELECT id, name, price FROM products WHERE seller_id IS NULL LIMIT 8');
    
    if (products.length === 0) {
      console.log('❌ No unassigned products found');
      process.exit(1);
    }
    
    console.log(`Found ${products.length} products to assign`);
    
    // Assign products to seller
    for (const product of products) {
      await db.promise().query(
        'UPDATE products SET seller_id = 1 WHERE id = ?',
        [product.id]
      );
      console.log(`✅ Assigned "${product.name}" to seller`);
    }
    
    // Create orders for these products
    console.log('\n📋 Creating orders...');
    
    // Get some customer users
    const [customers] = await db.promise().query('SELECT id, name FROM users WHERE role = "Customer" LIMIT 3');
    
    if (customers.length === 0) {
      console.log('❌ No customers found');
      process.exit(1);
    }
    
    // Create orders
    for (let i = 0; i < 5; i++) {
      const customer = customers[i % customers.length];
      const product = products[i % products.length];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const totalPrice = product.price * quantity;
      
      // Create order (using customer_id instead of user_id)
      const [orderResult] = await db.promise().query(
        'INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, ?)',
        [customer.id, totalPrice, ['Pending', 'Processing', 'Shipped', 'Delivered'][i % 4]]
      );
      
      const orderId = orderResult.insertId;
      
      // Create order item
      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, product.id, 1, quantity, product.price]
      );
      
      console.log(`✅ Order #${orderId}: ${customer.name} bought ${quantity}x ${product.name} ($${totalPrice})`);
    }
    
    // Update some products to have low stock
    console.log('\n⚠️ Creating low stock alerts...');
    const lowStockProducts = products.slice(0, 2);
    for (const product of lowStockProducts) {
      await db.promise().query(
        'UPDATE products SET stock = 8 WHERE id = ?',
        [product.id]
      );
      console.log(`✅ Low stock: ${product.name} (8 units)`);
    }
    
    console.log('\n🎉 Data assignment completed!');
    console.log('📊 Summary:');
    console.log(`  - Products assigned to seller: ${products.length}`);
    console.log(`  - Orders created: 5`);
    console.log(`  - Low stock products: 2`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

assignProductsToSeller();
