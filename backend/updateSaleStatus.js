const mysql = require('mysql2/promise');

// Update more products to be on sale so we have 8 featured products
const products = [
  {id: 6, isSale: 1}, // Laptop Stand
  {id: 7, isSale: 1}, // Decorative Lamp
  {id: 8, isSale: 1}, // Denim Jeans
  {id: 9, isSale: 1}, // Bluetooth Speaker
  {id: 10, isSale: 1}, // Winter Jacket
  {id: 11, isSale: 1}, // Wall Art
  {id: 12, isSale: 1}  // Fiction Novel
];

async function updateSaleStatus() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of products) {
      await connection.execute('UPDATE products SET isSale = ? WHERE id = ?', [product.isSale, product.id]);
      console.log(`Updated product ${product.id} isSale = ${product.isSale}`);
    }
    
    console.log('All sale statuses updated successfully!');
  } catch (error) {
    console.error('Error updating sale statuses:', error);
  } finally {
    await connection.end();
  }
}

updateSaleStatus();
