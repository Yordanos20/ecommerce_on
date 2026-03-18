const mysql = require('mysql2/promise');

// Fix categories for all products based on their names
const categoryFixes = [
  // Books - all should be Books category
  {id: 1, name: 'Programming Book', category: 'Books'},
  {id: 5, name: 'Literature Book', category: 'Books'},
  {id: 9, name: 'Finance Books', category: 'Books'},
  {id: 12, name: 'Spiritual Books', category: 'Books'},
  {id: 17, name: 'Children Books', category: 'Books'},
  
  // Clothes
  {id: 2, name: 'Shirt', category: 'Clothes'},
  {id: 10, name: 'Jeans', category: 'Clothes'},
  {id: 18, name: 'Jackets', category: 'Clothes'},
  {id: 20, name: 'Hats', category: 'Clothes'},
  
  // Electronics
  {id: 3, name: 'Smartphones', category: 'Electronics'},
  {id: 6, name: 'Laptops', category: 'Electronics'},
  {id: 11, name: 'Headphones', category: 'Electronics'},
  {id: 14, name: 'Desktops', category: 'Electronics'},
  {id: 19, name: 'Gaming Consoles', category: 'Electronics'},
  
  // Home & Living
  {id: 4, name: 'Lamps', category: 'Home & Living'},
  {id: 7, name: 'Sportswear', category: 'Home & Living'},
  {id: 8, name: 'Blankets', category: 'Home & Living'},
  {id: 13, name: 'Vases', category: 'Home & Living'},
  {id: 15, name: 'Chair', category: 'Home & Living'},
  {id: 16, name: 'Wall Art', category: 'Home & Living'}
];

async function fixProductCategories() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of categoryFixes) {
      await connection.execute('UPDATE products SET category = ? WHERE id = ?', 
        [product.category, product.id]);
      console.log(`Fixed product ${product.id} (${product.name}) category to: ${product.category}`);
    }
    
    console.log('All product categories fixed successfully!');
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    await connection.end();
  }
}

fixProductCategories();
