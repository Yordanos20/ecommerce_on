const mysql = require('mysql2/promise');

// Update products with specific names for different sections
const updates = [
  // Trending Products
  {id: 1, name: 'Programming Book', category: 'Books'},
  {id: 2, name: 'Shirt', category: 'Clothes'},
  {id: 3, name: 'Smartphones', category: 'Electronics'},
  {id: 4, name: 'Lamps', category: 'Home & Living'},
  
  // New Arrivals
  {id: 5, name: 'Literature Book', category: 'Books'},
  {id: 6, name: 'Laptops', category: 'Electronics'},
  {id: 7, name: 'Sportswear', category: 'Clothes'},
  {id: 8, name: 'Blankets', category: 'Home & Living'},
  
  // Featured Products
  {id: 9, name: 'Finance Books', category: 'Books'},
  {id: 10, name: 'Jeans', category: 'Clothes'},
  {id: 11, name: 'Headphones', category: 'Electronics'},
  {id: 12, name: 'Spiritual Books', category: 'Books'},
  {id: 13, name: 'Vases', category: 'Home & Living'},
  {id: 14, name: 'Desktops', category: 'Electronics'},
  {id: 15, name: 'Chair', category: 'Home & Living'},
  {id: 16, name: 'Wall Art', category: 'Home & Living'},
  
  // Recommended for You
  {id: 17, name: 'Children Books', category: 'Books'},
  {id: 18, name: 'Jackets', category: 'Clothes'},
  {id: 19, name: 'Gaming Consoles', category: 'Electronics'},
  {id: 20, name: 'Hats', category: 'Clothes'}
];

async function updateSectionProducts() {
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
    
    console.log('All section products updated!');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await connection.end();
  }
}

updateSectionProducts();
