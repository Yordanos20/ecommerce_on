const mysql = require('mysql2/promise');

const products = [
  {id: 5, rating: 4.1}, // Cookbook
  {id: 6, rating: 4.3}, // Laptop Stand
  {id: 7, rating: 4.6}, // Decorative Lamp
  {id: 8, rating: 4.2}, // Denim Jeans
  {id: 9, rating: 4.4}, // Bluetooth Speaker
  {id: 10, rating: 4.7}, // Winter Jacket
  {id: 11, rating: 4.5}, // Wall Art
  {id: 12, rating: 4.0}  // Fiction Novel
];

async function updateRatings() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of products) {
      await connection.execute('UPDATE products SET rating = ? WHERE id = ?', [product.rating, product.id]);
      console.log(`Updated product ${product.id} with rating ${product.rating}`);
    }
    
    console.log('All ratings updated successfully!');
  } catch (error) {
    console.error('Error updating ratings:', error);
  } finally {
    await connection.end();
  }
}

updateRatings();
