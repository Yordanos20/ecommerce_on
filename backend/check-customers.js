const db = require('./config/db');
const bcrypt = require('bcrypt');

async function checkCustomers() {
  try {
    console.log('Checking customer accounts...');
    
    // Get all customer users
    db.query("SELECT id, name, email, role FROM users WHERE role = 'Customer'", async (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      
      if (result.length === 0) {
        console.log('No customers found');
        return;
      }
      
      console.log('Found customers:', result);
      
      // Test the first customer with common passwords
      if (result.length > 0) {
        const customerId = result[0].id;
        const customerEmail = result[0].email;
        
        db.query("SELECT password FROM users WHERE id = ?", [customerId], async (err, pwdResult) => {
          if (err) {
            console.error('Error getting password:', err);
            return;
          }
          
          const passwordHash = pwdResult[0].password;
          const passwords = ['123456', 'password123', 'password'];
          
          console.log(`Testing passwords for ${customerEmail}:`);
          
          for (const password of passwords) {
            try {
              const isMatch = await bcrypt.compare(password, passwordHash);
              console.log(`Password '${password}':`, isMatch ? 'MATCH' : 'NO MATCH');
              
              if (isMatch) {
                console.log(`✅ Correct password found: ${password}`);
                console.log(`Login credentials: ${customerEmail} / ${password}`);
                break;
              }
            } catch (err) {
              console.error(`Error testing password '${password}':`, err);
            }
          }
          
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCustomers();
