const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
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
      await query("INSERT INTO sellers (user_id, store_name) VALUES (?, ?)", [
        newUserId,
        store_name || `${name}'s Store`,
      ]);
    }

    res.status(201).json({ message: "Registration successful ?" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find user
    const users = await query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role || 'Customer']);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Include seller_id in payload if seller
    if (String(user.role).toLowerCase() === "seller") {
      try {
        const sellers = await query(
          "SELECT id, store_name FROM sellers WHERE user_id = ?",
          [user.id]
        );

        if (sellers.length > 0) {
          payload.sellerId = sellers[0].id;
          payload.storeName = sellers[0].store_name;
        } else {
          // fallback if seller row is missing
          payload.sellerId = null;
          payload.storeName = null;
          console.warn(`Seller entry not found for user id ${user.id}`);
        }
      } catch (err) {
        console.error("Error fetching seller info:", err);
        payload.sellerId = null;
        payload.storeName = null;
      }
    }

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey123", {
      expiresIn: "7d",
    });

    // Remove password before sending
    delete user.password;

    res.json({
      message: "Login successful ?",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
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