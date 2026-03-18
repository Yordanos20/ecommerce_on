const mysql = require('mysql2/promise');

// Update products with specific names and categories
const updates = [
  {id: 3, name: 'Programming Book', category: 'Books'}, // was Programming Book
  {id: 4, name: 'Literature Book', category: 'Books'}, // was Programming Book (duplicate)
  {id: 5, name: 'Finance Book', category: 'Books'}, // was Cookbook
  {id: 12, name: 'Children Books', category: 'Books'}, // was Fiction Novel
  {id: 1, name: 'Smartphones', category: 'Electronics'}, // was Wireless Headphones
  {id: 2, name: 'Laptops', category: 'Electronics'}, // was Smart Watch
  {id: 6, name: 'Headphones', category: 'Electronics'}, // was Laptop Stand
  {id: 9, name: 'Gaming Consoles', category: 'Electronics'}, // was Bluetooth Speaker
  
  {id: 8, name: 'Shirts', category: 'Clothes'}, // was Denim Jeans
  {id: 10, name: 'Jeans', category: 'Clothes'}, // was Winter Jacket
  {id: 3, name: 'Jackets', category: 'Clothes'}, // was Cotton T-Shirt
  {id: 4, name: 'Sportswear', category: 'Clothes'}, // was Programming Book
  
  {id: 7, name: 'Lamps', category: 'Home & Living'}, // was Decorative Lamp
  {id: 11, name: 'Blankets', category: 'Home & Living'}, // was Wall Art
  {id: 5, name: 'Wall Art', category: 'Home & Living'}, // was Cookbook
  {id: 6, name: 'Vases', category: 'Home & Living'}, // was Laptop Stand
  {id: 12, name: 'Chairs', category: 'Home & Living'}  // was Fiction Novel
];

async function updateProducts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of updates) {
      await connection.execute('UPDATE products SET name = ?, category = ? WHERE id = ?', 
        [product.name, product.category, product.id]);
      console.log(`Updated product ${product.id}: ${product.name} (${product.category})`);
    }
    
    console.log('All products updated successfully!');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await connection.end();
  }
}

updateProducts();
