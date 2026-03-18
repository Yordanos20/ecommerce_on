const mysql = require('mysql2/promise');

// Fix specific products by ID
const fixes = [
  {id: 15, name: 'Chair', category: 'Home & Living'},
  {id: 16, name: 'Wall Art', category: 'Home & Living'},
  {id: 17, name: 'Children Books', category: 'Books'},
  {id: 18, name: 'Jackets', category: 'Clothes'},
  {id: 19, name: 'Gaming Consoles', category: 'Electronics'},
  {id: 20, name: 'Hats', category: 'Clothes'},
  {id: 13, name: 'Vases', category: 'Home & Living'},
  {id: 14, name: 'Desktops', category: 'Electronics'}
];

async function fixSpecificProducts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of fixes) {
      await connection.execute('UPDATE products SET name = ?, category = ? WHERE id = ?', 
        [product.name, product.category, product.id]);
      console.log(`Fixed ID ${product.id}: ${product.name} -> ${product.category}`);
    }
    
    console.log('All specific products fixed!');
  } catch (error) {
    console.error('Error fixing products:', error);
  } finally {
    await connection.end();
  }
}

fixSpecificProducts();
