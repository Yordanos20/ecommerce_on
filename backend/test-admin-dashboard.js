const db = require('./config/db');

async function testAdminDashboard() {
  try {
    console.log('Testing admin dashboard...');
    
    // Check if there are any admin users
    const [adminUsers] = await db.promise().query(
      "SELECT id, name, email, role FROM users WHERE LOWER(role) = 'admin'"
    );
    console.log('Admin users found:', adminUsers.length);
    
    if (adminUsers.length === 0) {
      console.log('No admin users found. Creating one...');
      
      // Create an admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const [result] = await db.promise().query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin User', 'admin@test.com', hashedPassword, 'Admin']
      );
      
      console.log('Created admin user with ID:', result.insertId);
      console.log('Login credentials: admin@test.com / admin123');
    } else {
      console.log('Existing admin users:');
      adminUsers.forEach(user => {
        console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
    
    // Test basic queries that the dashboard uses
    const [users] = await db.promise().query("SELECT COUNT(*) AS totalUsers FROM users");
    const [sellers] = await db.promise().query("SELECT COUNT(*) AS totalSellers FROM users WHERE LOWER(role)='seller'");
    const [customers] = await db.promise().query("SELECT COUNT(*) AS totalCustomers FROM users WHERE LOWER(role)='customer'");
    const [orders] = await db.promise().query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [revenue] = await db.promise().query("SELECT SUM(total_price) AS totalRevenue FROM orders");
    
    console.log('Dashboard test results:');
    console.log('Total users:', users[0].totalUsers);
    console.log('Total sellers:', sellers[0].totalSellers);
    console.log('Total customers:', customers[0].totalCustomers);
    console.log('Total orders:', orders[0].totalOrders);
    console.log('Total revenue:', revenue[0].totalRevenue);
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    process.exit(0);
  }
}

testAdminDashboard();
