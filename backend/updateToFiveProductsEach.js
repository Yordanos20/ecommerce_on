const mysql = require('mysql2/promise');

// Update all products to have exactly 5 in each category
const finalUpdates = [
  // Books category - exactly 5 products
  {id: 1, name: 'Programming Book', category: 'Books'},
  {id: 5, name: 'Literature Book', category: 'Books'},
  {id: 9, name: 'Finance Books', category: 'Books'},
  {id: 12, name: 'Spiritual Books', category: 'Books'},
  {id: 17, name: 'Children Books', category: 'Books'},
  
  // Clothes category - exactly 5 products
  {id: 2, name: 'Shirt', category: 'Clothes'},
  {id: 10, name: 'Jeans', category: 'Clothes'},
  {id: 18, name: 'Jackets', category: 'Clothes'},
  {id: 7, name: 'Sportswear', category: 'Clothes'},
  {id: 20, name: 'Hats', category: 'Clothes'},
  
  // Electronics category - exactly 5 products
  {id: 3, name: 'Smartphones', category: 'Electronics'},
  {id: 6, name: 'Laptops', category: 'Electronics'},
  {id: 11, name: 'Headphones', category: 'Electronics'},
  {id: 19, name: 'Gaming Consoles', category: 'Electronics'},
  {id: 14, name: 'Desktops', category: 'Electronics'},
  
  // Home & Living category - exactly 5 products
  {id: 4, name: 'Lamps', category: 'Home & Living'},
  {id: 8, name: 'Blankets', category: 'Home & Living'},
  {id: 16, name: 'Wall Art', category: 'Home & Living'},
  {id: 13, name: 'Vases', category: 'Home & Living'},
  {id: 15, name: 'Chair', category: 'Home & Living'}
];

async function updateToFiveProductsEach() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of finalUpdates) {
      await connection.execute('UPDATE products SET name = ?, category = ? WHERE id = ?', 
        [product.name, product.category, product.id]);
      console.log(`Updated ID ${product.id}: ${product.name} -> ${product.category}`);
    }
    
    console.log('All products updated to 5 per category!');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await connection.end();
  }
}

updateToFiveProductsEach();
