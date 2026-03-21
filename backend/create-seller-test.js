const db = require('./config/db');
const bcrypt = require('bcrypt');

async function createTestSeller() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Creating test seller...');
      
      // Check if seller already exists
      db.query("SELECT * FROM users WHERE email = 'seller@test.com'", async (err, result) => {
        if (err) {
          console.error('Error checking existing seller:', err);
          reject(err);
          return;
        }
        
        if (result.length > 0) {
          console.log('Test seller already exists:', result[0]);
          resolve(result[0]);
          return;
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        
        // Insert seller user
        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          ['Test Seller', 'seller@test.com', hashedPassword, 'Seller'],
          async (err, result) => {
            if (err) {
              console.error('Error creating seller:', err);
              reject(err);
              return;
            }
            
            const userId = result.insertId;
            console.log('Seller created successfully with ID:', userId);
            
            // Create sellers table entry
            db.query(
              "INSERT INTO sellers (user_id, store_name, approval_status) VALUES (?, ?, ?)",
              [userId, 'Test Store', 'Approved'],
              (err, sellerResult) => {
                if (err) {
                  console.error('Error creating seller entry:', err);
                  reject(err);
                } else {
                  console.log('Seller entry created successfully');
                  resolve({ id: userId, email: 'seller@test.com', role: 'Seller' });
                }
              }
            );
          }
        );
      });
      
    } catch (error) {
      console.error('Error:', error);
      reject(error);
    }
  });
}

// Test the creation
createTestSeller()
  .then((seller) => {
    console.log('Test seller created/verified successfully!');
    console.log('Login credentials: seller@test.com / 123456');
    console.log('Seller data:', seller);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create test seller:', error);
    process.exit(1);
  });
