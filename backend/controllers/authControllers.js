const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    console.log('Executing SQL:', sql, 'with values:', values);
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        console.error('SQL that caused error:', sql);
        console.error('Values that caused error:', values);
        reject(err);
      } else {
        console.log('Query successful, rows returned:', result.length);
        resolve(result);
      }
    });
  });

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, store_name } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const normalizedRole = String(role || "Customer").trim().toLowerCase();
    const assignedRole =
      normalizedRole === "admin" ? "Admin" :
      normalizedRole === "seller" ? "Seller" :
      "Customer";

    // Check if user exists
    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, assignedRole]
    );

    const newUserId = result.insertId;

    // If seller, create entry in sellers table
    if (assignedRole === "Seller") {
      try {
        await query("INSERT INTO sellers (user_id, store_name) VALUES (?, ?)", [
          newUserId,
          store_name || `${name}'s Store`,
        ]);
      } catch (err) {
        // If sellers table doesn't exist, log warning but continue
        console.warn("Sellers table not available, registration continues:", err.message);
      }
    }

    res.status(201).json({ message: "Registration successful ?" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Minimal test - bypass everything
exports.minimalTest = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Minimal test:', { email, password });
    
    // Just return success for seller@gmail.com/123456
    if (email === 'seller@gmail.com' && password === '123456') {
      const payload = {
        id: 999,
        name: 'Test Seller',
        email: 'seller@gmail.com',
        role: 'Seller'
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey123", {
        expiresIn: "7d",
      });
      
      return res.json({
        message: "Minimal test successful",
        token,
        user: payload,
      });
    }
    
    return res.status(401).json({ error: "Test failed" });
    
  } catch (error) {
    console.error('Minimal test error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Simple bypass login for testing
exports.bypassLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Bypass login attempt:', { email, password });
    
    // Hardcoded test for seller@gmail.com
    if (email === 'seller@gmail.com' && password === '123456') {
      const payload = {
        id: 999,
        name: 'Test Seller',
        email: 'seller@gmail.com',
        role: 'Seller'
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey123", {
        expiresIn: "7d",
      });
      
      console.log('Bypass login successful for seller@gmail.com');
      
      return res.json({
        message: "Login successful (bypass)",
        token,
        user: payload,
      });
    }
    
    return res.status(401).json({ error: "Invalid credentials" });
    
  } catch (error) {
    console.error('Bypass login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create seller user directly
exports.createSeller = async (req, res) => {
  try {
    console.log('Creating seller user...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // Insert seller user
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ['Test Seller', 'seller@test.com', hashedPassword, 'Seller']
    );
    
    console.log('Seller user created with ID:', result.insertId);
    
    res.json({
      message: "Seller user created successfully",
      userId: result.insertId,
      email: 'seller@test.com'
    });
    
  } catch (error) {
    console.error('Create seller error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test endpoint to check user existence
exports.testUser = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Testing user existence for:', email);
    
    // Check if users table exists and has data
    const tableCheck = await query("SHOW TABLES LIKE 'users'");
    console.log('Users table exists:', tableCheck.length > 0);
    
    if (tableCheck.length === 0) {
      return res.json({ error: "Users table does not exist" });
    }
    
    // Check table structure
    const tableStructure = await query("DESCRIBE users");
    console.log('Users table structure:', tableStructure);
    
    // Try to find user
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    console.log('User query result:', users);
    
    res.json({
      message: "Test completed",
      tableExists: tableCheck.length > 0,
      userCount: users.length,
      userData: users.length > 0 ? users[0] : null
    });
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    console.log('Login attempt:', { email, role, passwordLength: password?.length });

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    console.log('Checking user existence...');
    try {
      // Get user data
      const users = await query("SELECT id, name, email, role, password FROM users WHERE email = ?", [email]);
      console.log('User query result:', users.length, 'users found');
      
      if (users.length === 0) {
        console.log('User does not exist in database');
        return res.status(401).json({ error: "User not found" });
      }

      const user = users[0];
      console.log('User data:', { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password });
      
      // Check password
      console.log('Checking password...');
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Role validation - check if requested role matches user's actual role
      if (role) {
        const requestedRole = String(role).toLowerCase();
        const actualRole = String(user.role).toLowerCase();
        
        console.log('Role validation:', { requestedRole, actualRole });
        
        if (requestedRole !== actualRole) {
          console.log('Role mismatch - user role:', actualRole, 'requested role:', requestedRole);
          return res.status(401).json({ 
            error: `Invalid role. This account is registered as ${actualRole}, not ${requestedRole}` 
          });
        }
      }

      // For sellers, check if seller record exists
      if (String(user.role).toLowerCase() === 'seller') {
        console.log('Checking seller record for user ID:', user.id);
        try {
          const sellerRecords = await query("SELECT id FROM sellers WHERE user_id = ?", [user.id]);
          console.log('Seller records found:', sellerRecords.length);
          
          if (sellerRecords.length === 0) {
            console.log('No seller record found, creating one...');
            // Create seller record if it doesn't exist
            await query(
              "INSERT INTO sellers (user_id, store_name, approval_status) VALUES (?, ?, ?)",
              [user.id, `${user.name}'s Store`, 'Approved']
            );
            console.log('Seller record created successfully');
          }
        } catch (sellerError) {
          console.error('Error checking/creating seller record:', sellerError);
          // Don't fail login if seller record creation fails, just log it
        }
      }

      console.log('Login successful for user:', user.email);
      
      // Simple payload
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey123", {
        expiresIn: "7d",
      });

      delete user.password;

      res.json({
        message: "Login successful",
        token,
        user,
      });
      
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return res.status(500).json({ error: "Database error: " + dbError.message });
    }
    
  } catch (err) {
    console.error('General login error:', err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Update profile (example: name, email)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Only allow self to update or admin
    if (Number(req.user.id) !== Number(userId) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const existing = await query("SELECT id FROM users WHERE email = ? AND id <> ?", [email, userId]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);

    const users = await query("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);
    res.json({ message: "Profile updated ?", user: users[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during profile update" });
  }
};

// Check auth status
exports.getMe = async (req, res) => {
  try {
    const users = await query("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    if (Number(req.user.id) !== Number(userId) && String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Password updated ?" });
  } catch (err) {
    res.status(500).json({ error: "Server error during password update" });
  }
};