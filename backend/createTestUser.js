const bcrypt = require("bcryptjs");
const db = require("./config/db");

// Create test customer user
const users = [
  {
    name: "Test Customer",
    email: "customer@test.com",
    password: "123456",
    role: "Customer"
  },
  {
    name: "Test Seller",
    email: "seller@test.com", 
    password: "123456",
    role: "Seller",
    store_name: "Test Store"
  }
];

async function createUsers() {
  try {
    for (const userData of users) {
      const { name, email, password, role, store_name } = userData;
      
      // Check if user already exists
      const existing = await new Promise((resolve, reject) => {
        db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      if (existing.length > 0) {
        console.log(`User ${email} already exists ✅`);
        continue;
      }
      
      // Hash password
      const hash = await bcrypt.hash(password, 10);
      
      // Insert user
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hash, role],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      
      // If seller, create seller entry
      if (role === 'Seller') {
        await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO sellers (user_id, store_name, approval_status) VALUES (?, ?, ?)",
            [result.insertId, store_name || 'Default Store', 'Approved'],
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });
      }
      
      console.log(`Created ${role}: ${email} ✅`);
    }
    
    console.log("\nTest users created successfully!");
    console.log("Admin: madmin@gmail.com / 123456");
    console.log("Customer: customer@test.com / 123456");
    console.log("Seller: seller@test.com / 123456");
    
    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createUsers();
