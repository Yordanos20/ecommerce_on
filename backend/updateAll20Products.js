const mysql = require('mysql2/promise');

// Update ALL 20 products with the specific names you requested
const updates = [
  // Books (8 products)
  {id: 1, name: 'Programming Book', category: 'Books'},
  {id: 2, name: 'Literature Book', category: 'Books'},
  {id: 3, name: 'Finance Book', category: 'Books'},
  {id: 4, name: 'Children Books', category: 'Books'},
  {id: 5, name: 'Spiritual Books', category: 'Books'},
  {id: 6, name: 'Programming Book', category: 'Books'},
  {id: 7, name: 'Literature Book', category: 'Books'},
  {id: 8, name: 'Finance Book', category: 'Books'},
  
  // Clothes (5 products)
  {id: 9, name: 'Shirts', category: 'Clothes'},
  {id: 10, name: 'Jeans', category: 'Clothes'},
  {id: 11, name: 'Jackets', category: 'Clothes'},
  {id: 12, name: 'Sportswear', category: 'Clothes'},
  {id: 13, name: 'Hats', category: 'Clothes'},
  
  // Electronics (5 products)
  {id: 14, name: 'Smartphones', category: 'Electronics'},
  {id: 15, name: 'Laptops', category: 'Electronics'},
  {id: 16, name: 'Headphones', category: 'Electronics'},
  {id: 17, name: 'Gaming Consoles', category: 'Electronics'},
  {id: 18, name: 'Desktops', category: 'Electronics'},
  
  // Home & Living (2 products)
  {id: 19, name: 'Lamps', category: 'Home & Living'},
  {id: 20, name: 'Blankets', category: 'Home & Living'}
];

async function updateAllProducts() {
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
    
    console.log('All 20 products updated successfully!');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await connection.end();
  }
}

updateAllProducts();
