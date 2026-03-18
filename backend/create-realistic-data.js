const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createRealisticData() {
  try {
    console.log('🌍 Creating realistic e-commerce data...');
    
    // 1. Create Customers
    console.log('\n👥 Creating Customers...');
    const customers = [];
    const customerNames = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'Robert Wilson'];
    const customerEmails = ['john.smith@email.com', 'emma.j@email.com', 'm.brown@email.com', 'sarah.d@email.com', 'r.wilson@email.com'];
    
    for (let i = 0; i < customerNames.length; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [result] = await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [customerNames[i], customerEmails[i], hashedPassword, 'Customer']
      );
      customers.push({ id: result.insertId, name: customerNames[i], email: customerEmails[i] });
      console.log(`  ✅ Created customer: ${customerNames[i]}`);
    }
    
    // 2. Get existing seller
    const [sellers] = await db.promise().query('SELECT id, user_id, store_name FROM sellers LIMIT 1');
    if (sellers.length === 0) {
      console.log('❌ No seller found. Please create a seller first.');
      process.exit(1);
    }
    const seller = sellers[0];
    console.log(`  ✅ Using seller: ${seller.store_name} (ID: ${seller.id})`);
    
    // 3. Create Products for Seller
    console.log('\n📦 Creating Products...');
    const productData = [
      { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones', price: 89.99, stock: 45 },
      { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', price: 199.99, stock: 30 },
      { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for better ergonomics', price: 34.99, stock: 60 },
      { name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader', price: 49.99, stock: 25 },
      { name: 'Phone Case', description: 'Protective phone case with kickstand and card holder', price: 19.99, stock: 100 },
      { name: 'Bluetooth Speaker', description: 'Portable waterproof bluetooth speaker with bass boost', price: 59.99, stock: 35 },
      { name: 'Webcam HD', description: '1080p HD webcam with built-in microphone', price: 79.99, stock: 20 },
      { name: 'Mouse Pad XXL', description: 'Extended gaming mouse pad with RGB lighting', price: 24.99, stock: 80 }
    ];
    
    const products = [];
    for (const product of productData) {
      const [result] = await db.promise().query(
        `INSERT INTO products (name, description, price, stock, seller_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [product.name, product.description, product.price, product.stock, seller.id]
      );
      products.push({ 
        id: result.insertId, 
        name: product.name, 
        price: product.price, 
        stock: product.stock 
      });
      console.log(`  ✅ Created product: ${product.name} ($${product.price})`);
    }
    
    // 4. Create Orders with realistic scenarios
    console.log('\n📋 Creating Orders...');
    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const orders = [];
    
    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const selectedProducts = [];
      let totalPrice = 0;
      
      // Select random products
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        totalPrice += product.price * quantity;
        selectedProducts.push({ product, quantity });
      }
      
      // Create order
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const [orderResult] = await db.promise().query(
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
        [customer.id, totalPrice, status]
      );
      
      const orderId = orderResult.insertId;
      
      // Create order items
      for (const { product, quantity } of selectedProducts) {
        await db.promise().query(
          'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
          [orderId, product.id, seller.id, quantity, product.price]
        );
      }
      
      orders.push({ 
        id: orderId, 
        customer: customer.name, 
        total: totalPrice, 
        status,
        items: selectedProducts.length
      });
      
      console.log(`  ✅ Order #${orderId}: ${customer.name} - $${totalPrice.toFixed(2)} (${status})`);
    }
    
    // 5. Create Reviews
    console.log('\n⭐ Creating Reviews...');
    const reviewComments = [
      'Excellent product! Highly recommended.',
      'Good quality, fast shipping.',
      'Exactly as described, very happy with purchase.',
      'Great value for money.',
      'Product works perfectly, no issues.',
      'Would buy again, excellent customer service.',
      'Premium quality, worth every penny.',
      'Better than expected, very satisfied.'
    ];
    
    for (let i = 0; i < 12; i++) {
      const product = products[i % products.length];
      const customer = customers[i % customers.length];
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      
      await db.promise().query(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [product.id, customer.id, rating, comment]
      );
      
      console.log(`  ✅ Review: ${product.name} - ${rating} stars by ${customer.name}`);
    }
    
    // 6. Create Admin user if not exists
    console.log('\n👨‍💼 Checking Admin...');
    const [adminUsers] = await db.promise().query('SELECT id FROM users WHERE LOWER(role) = "admin"');
    if (adminUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const [result] = await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@test.com', hashedPassword, 'Admin']
      );
      console.log(`  ✅ Created admin user: admin@test.com / admin123`);
    } else {
      console.log(`  ✅ Admin user already exists`);
    }
    
    // 7. Update some product stock to create low stock alerts
    console.log('\n⚠️ Creating Low Stock Alerts...');
    const lowStockProducts = products.slice(0, 2);
    for (const product of lowStockProducts) {
      await db.promise().query(
        'UPDATE products SET stock = ? WHERE id = ?',
        [8, product.id] // Set stock to 8 (below threshold of 10)
      );
      console.log(`  ✅ Low stock alert: ${product.name} (8 units remaining)`);
    }
    
    // 8. Display Summary
    console.log('\n📊 DATA CREATION SUMMARY');
    console.log('================================');
    console.log(`👥 Customers: ${customers.length}`);
    console.log(`🏪 Sellers: 1 (${seller.store_name})`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`📋 Orders: ${orders.length}`);
    console.log(`⭐ Reviews: 12`);
    console.log(`⚠️ Low Stock Products: 2`);
    
    console.log('\n🔐 LOGIN CREDENTIALS');
    console.log('================================');
    console.log('👨‍💼 Admin: admin@test.com / admin123');
    console.log(`🏪 Seller: seller@test.com / password123`);
    console.log('👥 Customers:');
    for (let i = 0; i < customers.length; i++) {
      console.log(`   - ${customers[i].email} / password123`);
    }
    
    console.log('\n🎉 Realistic e-commerce data created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

createRealisticData();
