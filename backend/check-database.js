const db = require('./config/db');

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Test basic connection
    const [test] = await db.promise().query('SELECT 1 as test');
    console.log('✅ Database connection successful:', test[0]);
    
    // Check if users table exists and has data
    const [users] = await db.promise().query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table exists, total users:', users[0].count);
    
    // Check admin users
    const [admins] = await db.promise().query("SELECT id, name, email, role FROM users WHERE LOWER(role) = 'admin'");
    console.log('✅ Admin users found:', admins.length);
    if (admins.length > 0) {
      admins.forEach(admin => {
        console.log(`  - ID: ${admin.id}, Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
      });
    } else {
      console.log('❌ No admin users found in database');
    }
    
    // Check other tables
    const [orders] = await db.promise().query('SELECT COUNT(*) as count FROM orders');
    console.log('✅ Orders table exists, total orders:', orders[0].count);
    
    const [products] = await db.promise().query('SELECT COUNT(*) as count FROM products');
    console.log('✅ Products table exists, total products:', products[0].count);
    
    console.log('✅ All checks completed successfully');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
