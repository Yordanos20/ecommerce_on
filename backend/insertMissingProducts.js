const mysql = require('mysql2/promise');

// Insert the missing products (IDs 13-20)
const newProducts = [
  {id: 13, name: 'Vases', category: 'Home & Living', price: 29.99, stock: 25, isNew: 1, isSale: 1, rating: 4.3},
  {id: 14, name: 'Desktops', category: 'Electronics', price: 899.99, stock: 15, isNew: 1, isSale: 1, rating: 4.6},
  {id: 15, name: 'Chair', category: 'Home & Living', price: 149.99, stock: 20, isNew: 1, isSale: 1, rating: 4.2},
  {id: 16, name: 'Wall Art', category: 'Home & Living', price: 79.99, stock: 18, isNew: 1, isSale: 1, rating: 4.5},
  {id: 17, name: 'Children Books', category: 'Books', price: 14.99, stock: 30, isNew: 1, isSale: 1, rating: 4.4},
  {id: 18, name: 'Jackets', category: 'Clothes', price: 89.99, stock: 22, isNew: 1, isSale: 1, rating: 4.7},
  {id: 19, name: 'Gaming Consoles', category: 'Electronics', price: 399.99, stock: 12, isNew: 1, isSale: 1, rating: 4.8},
  {id: 20, name: 'Hats', category: 'Clothes', price: 24.99, stock: 35, isNew: 1, isSale: 1, rating: 4.1}
];

async function insertMissingProducts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '161920',
    database: 'ecommerce'
  });
  
  try {
    for (const product of newProducts) {
      await connection.execute(
        'INSERT INTO products (id, name, category, price, stock, isNew, isSale, rating, description, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [
          product.id,
          product.name,
          product.category,
          product.price,
          product.stock,
          product.isNew,
          product.isSale,
          product.rating,
          `High quality ${product.name.toLowerCase()} for your needs`,
          `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400`
        ]
      );
      console.log(`Inserted product ${product.id}: ${product.name}`);
    }
    
    console.log('All missing products inserted successfully!');
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    await connection.end();
  }
}

insertMissingProducts();
