const mysql = require('mysql2/promise');

// Update categories with specific names
const categories = [
  {id: 1, name: 'Electronics'},
  {id: 2, name: 'Clothes'},
  {id: 3, name: 'Books'},
  {id: 4, name: 'Home & Living'}
];

async function updateCategories() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const category of categories) {
      await connection.execute('UPDATE categories SET name = ? WHERE id = ?', 
        [category.name, category.id]);
      console.log(`Updated category ${category.id}: ${category.name}`);
    }
    
    console.log('All categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await connection.end();
  }
}

updateCategories();
