const mysql = require('mysql2/promise');

// Update only categories for specific products
const categoryUpdates = [
  // Books category (IDs 1, 5, 9, 12, 17)
  {id: 1, category: 'Books'},     // Programming Book
  {id: 5, category: 'Books'},     // Literature Book  
  {id: 9, category: 'Books'},     // Finance Books
  {id: 12, category: 'Books'},    // Spiritual Books
  {id: 17, category: 'Books'},    // Children Books
  
  // Clothes category (IDs 2, 10, 18, 20)
  {id: 2, category: 'Clothes'},    // Shirt
  {id: 10, category: 'Clothes'},   // Jeans
  {id: 18, category: 'Clothes'},   // Jackets
  {id: 20, category: 'Clothes'},   // Hats
  
  // Electronics category (IDs 3, 6, 11, 14, 19)
  {id: 3, category: 'Electronics'}, // Smartphones
  {id: 6, category: 'Electronics'}, // Laptops
  {id: 11, category: 'Electronics'}, // Headphones
  {id: 14, category: 'Electronics'}, // Desktops
  {id: 19, category: 'Electronics'}, // Gaming Consoles
  
  // Home & Living category (IDs 4, 7, 8, 13, 15, 16)
  {id: 4, category: 'Home & Living'},   // Lamps
  {id: 7, category: 'Home & Living'},   // Sportswear (update to Home & Living as requested)
  {id: 8, category: 'Home & Living'},   // Blankets
  {id: 13, category: 'Home & Living'},  // Vases
  {id: 15, category: 'Home & Living'},  // Chair
  {id: 16, category: 'Home & Living'}   // Wall Art
];

async function updateCategoriesOnly() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of categoryUpdates) {
      await connection.execute('UPDATE products SET category = ? WHERE id = ?', 
        [product.category, product.id]);
      console.log(`Updated product ${product.id} category to: ${product.category}`);
    }
    
    console.log('All categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await connection.end();
  }
}

updateCategoriesOnly();
