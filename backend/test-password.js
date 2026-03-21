const db = require('./config/db');
const bcrypt = require('bcrypt');

async function testLogin() {
  try {
    console.log('Testing seller login...');
    
    // Get the seller user
    db.query("SELECT * FROM users WHERE email = 'seller@test.com'", async (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      
      if (result.length === 0) {
        console.log('No seller found');
        return;
      }
      
      const user = result[0];
      console.log('Found user:', { id: user.id, email: user.email, role: user.role });
      
      // Test password verification
      const passwords = ['123456', 'password123', 'password'];
      
      for (const password of passwords) {
        try {
          const isMatch = await bcrypt.compare(password, user.password);
          console.log(`Password '${password}':`, isMatch ? 'MATCH' : 'NO MATCH');
          
          if (isMatch) {
            console.log(`✅ Correct password found: ${password}`);
            console.log(`Login credentials: seller@test.com / ${password}`);
            break;
          }
        } catch (err) {
          console.error(`Error testing password '${password}':`, err);
        }
      }
      
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
