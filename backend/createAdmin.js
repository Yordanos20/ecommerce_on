// backend/createAdmin.js
const bcrypt = require("bcryptjs");
const db = require("./config/db");

// Set admin credentials
const name = "Admin";
const email = "madmin@gmail.com";
const password = "123456"; // you can change it to a stronger password
const role = "admin";

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  // Insert into database
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hash, role],
    (err, result) => {
      if (err) throw err;
      console.log("Admin created ✅");
      process.exit();
    }
  );
});