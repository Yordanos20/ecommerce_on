const db = require('./config/db');
const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '161920',
      database: process.env.DB_NAME || 'ecommerce'
    });

    console.log('=== Checking users table ===');
    const [users] = await connection.execute("SELECT id, name, email, role FROM users WHERE role = 'Seller'");
    console.log('Sellers found:', users);

    console.log('\n=== Checking sellers table ===');
    try {
      const [sellers] = await connection.execute('SELECT * FROM sellers');
      console.log('Sellers table data:', sellers);
    } catch (err) {
      console.log('Sellers table error:', err.message);
    }

    console.log('\n=== Checking table structures ===');
    const [usersStruct] = await connection.execute('DESCRIBE users');
    console.log('Users table structure:', usersStruct.map(col => ({ Field: col.Field, Type: col.Type, Null: col.Null, Key: col.Key })));

    try {
      const [sellersStruct] = await connection.execute('DESCRIBE sellers');
      console.log('Sellers table structure:', sellersStruct.map(col => ({ Field: col.Field, Type: col.Type, Null: col.Null, Key: col.Key })));
    } catch (err) {
      console.log('Sellers table structure error:', err.message);
    }

    await connection.end();
  } catch (error) {
    console.error('Database check error:', error);
  }
}

checkDatabase();
