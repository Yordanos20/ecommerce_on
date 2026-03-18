const mysql = require('mysql2/promise');

// Update categories based on exact product names
const correctCategories = [
  // Books category - match exact names
  {name: 'Programming Book', category: 'Books'},
  {name: 'Literature Book', category: 'Books'},
  {name: 'Finance Books', category: 'Books'},
  {name: 'Children Books', category: 'Books'},
  {name: 'Spiritual Books', category: 'Books'},
  
  // Clothes category - match exact names
  {name: 'Shirt', category: 'Clothes'},
  {name: 'Jeans', category: 'Clothes'},
  {name: 'Jackets', category: 'Clothes'},
  {name: 'Sportswear', category: 'Clothes'},
  {name: 'Hats', category: 'Clothes'},
  
  // Electronics category - match exact names
  {name: 'Smartphones', category: 'Electronics'},
  {name: 'Laptops', category: 'Electronics'},
  {name: 'Headphones', category: 'Electronics'},
  {name: 'Gaming Consoles', category: 'Electronics'},
  {name: 'Desktops', category: 'Electronics'},
  
  // Home & Living category - match exact names
  {name: 'Lamps', category: 'Home & Living'},
  {name: 'Blankets', category: 'Home & Living'},
  {name: 'Wall Art', category: 'Home & Living'},
  {name: 'Vases', category: 'Home & Living'},
  {name: 'Chair', category: 'Home & Living'}
];

async function updateCorrectCategories() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const item of correctCategories) {
      await connection.execute('UPDATE products SET category = ? WHERE name = ?', 
        [item.category, item.name]);
      console.log(`Updated ${item.name} to category: ${item.category}`);
    }
    
    console.log('All categories updated correctly!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await connection.end();
  }
}

updateCorrectCategories();
