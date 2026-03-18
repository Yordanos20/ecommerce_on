const mysql = require('mysql2/promise');

// Update products with ALL the specific names you requested
const updates = [
  // Books Category
  {id: 3, name: 'Programming Book', category: 'Books'},
  {id: 4, name: 'Literature Book', category: 'Books'},
  {id: 5, name: 'Finance Book', category: 'Books'},
  {id: 12, name: 'Children Books', category: 'Books'},
  {id: 7, name: 'Spiritual Books', category: 'Books'},
  
  // Clothes Category  
  {id: 8, name: 'Shirts', category: 'Clothes'},
  {id: 10, name: 'Jeans', category: 'Clothes'},
  {id: 3, name: 'Jackets', category: 'Clothes'},
  {id: 4, name: 'Sportswear', category: 'Clothes'},
  {id: 9, name: 'Hats', category: 'Clothes'},
  
  // Electronics Category
  {id: 1, name: 'Smartphones', category: 'Electronics'},
  {id: 2, name: 'Laptops', category: 'Electronics'},
  {id: 6, name: 'Headphones', category: 'Electronics'},
  {id: 9, name: 'Gaming Consoles', category: 'Electronics'},
  {id: 11, name: 'Desktops', category: 'Electronics'},
  
  // Home & Living Category
  {id: 7, name: 'Lamps', category: 'Home & Living'},
  {id: 11, name: 'Blankets', category: 'Home & Living'},
  {id: 5, name: 'Wall Art', category: 'Home & Living'},
  {id: 6, name: 'Vases', category: 'Home & Living'},
  {id: 12, name: 'Chairs', category: 'Home & Living'}
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
