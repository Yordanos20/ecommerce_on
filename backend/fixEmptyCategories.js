const mysql = require('mysql2/promise');

async function fixEmptyCategories() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    // Get products with empty categories
    const [products] = await connection.execute('SELECT id, name FROM products WHERE category = "" OR category IS NULL');
    
    for (const product of products) {
      let category = '';
      const name = product.name;
      
      // Set category based on exact name match
      if (name.includes('Book') || name.includes('Programming') || name.includes('Literature') || name.includes('Finance') || name.includes('Children') || name.includes('Spiritual')) {
        category = 'Books';
      } else if (name.includes('Shirt') || name.includes('Jeans') || name.includes('Jackets') || name.includes('Sportswear') || name.includes('Hats')) {
        category = 'Clothes';
      } else if (name.includes('Smartphones') || name.includes('Laptops') || name.includes('Headphones') || name.includes('Gaming') || name.includes('Desktops')) {
        category = 'Electronics';
      } else if (name.includes('Lamps') || name.includes('Blankets') || name.includes('Wall Art') || name.includes('Vases') || name.includes('Chair')) {
        category = 'Home & Living';
      }
      
      await connection.execute('UPDATE products SET category = ? WHERE id = ?', [category, product.id]);
      console.log(`Fixed ${name} (ID: ${product.id}) to category: ${category}`);
    }
    
    console.log('All empty categories fixed!');
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    await connection.end();
  }
}

fixEmptyCategories();
