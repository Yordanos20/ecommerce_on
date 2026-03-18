const db = require('./config/db');

async function createSellerSpecificData() {
  try {
    console.log('🔧 Creating seller-specific data...');
    
    // Get the seller ID
    const [sellers] = await db.promise().query('SELECT id FROM sellers WHERE user_id = 3');
    if (sellers.length === 0) {
      console.log('❌ No seller found for user ID 3');
      process.exit(1);
    }
    
    const sellerId = sellers[0].id;
    console.log(`✅ Found seller with ID: ${sellerId}`);
    
    // Create products for this seller
    const products = [];
    for (let i = 1; i <= 5; i++) {
      const [result] = await db.promise().query(
        `INSERT INTO products (name, description, price, stock, seller_id, is_approved, category_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`Seller Product ${i}`, `High quality product ${i} from our store`, 49.99 * i, 50 + i * 10, sellerId, 1, 1]
      );
      products.push({ id: result.insertId, name: `Seller Product ${i}`, price: 49.99 * i });
      console.log(`✅ Created product: Seller Product ${i}`);
    }
    
    // Create some customers
    const customers = [];
    for (let i = 1; i <= 3; i++) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const [result] = await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [`Customer ${i}`, `customer${i}@test.com`, hashedPassword, 'Customer']
      );
      customers.push({ id: result.insertId, name: `Customer ${i}` });
      console.log(`✅ Created customer: Customer ${i}`);
    }
    
    // Create orders with items for this seller
    for (let i = 1; i <= 5; i++) {
      const customer = customers[i % customers.length];
      const product = products[i % products.length];
      
      // Create order
      const [orderResult] = await db.promise().query(
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
        [customer.id, product.price * 2, ['Pending', 'Processing', 'Shipped', 'Delivered'][i % 4]]
      );
      
      const orderId = orderResult.insertId;
      
      // Create order item for this seller
      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, product.id, sellerId, 2, product.price]
      );
      
      console.log(`✅ Created order ${orderId} for ${customer.name} - ${product.name}`);
    }
    
    // Create some reviews for the products
    for (let i = 1; i <= 3; i++) {
      const product = products[i % products.length];
      const customer = customers[i % customers.length];
      
      await db.promise().query(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [product.id, customer.id, [4, 5, 5][i % 3], `Great product! Would buy again. Review ${i}`]
      );
      
      console.log(`✅ Created review for ${product.name}`);
    }
    
    console.log('\n🎉 Seller-specific data created successfully!');
    console.log('📊 Summary:');
    console.log(`  - Products: ${products.length}`);
    console.log(`  - Customers: ${customers.length}`);
    console.log(`  - Orders: 5`);
    console.log(`  - Reviews: 3`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

createSellerSpecificData();
