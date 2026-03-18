// backend/routes/users.js

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  getMe,
  updatePassword,
} = require("../controllers/authControllers");
const auth = require("../config/middleware/auth");

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Update user profile (requires auth)
router.put("/:id", auth, updateProfile);

// Update password (requires auth)
router.put("/:id/password", auth, updatePassword);

// Get current user details
router.get("/me", auth, getMe);

/* ================================
   TEST USERS ROUTE
================================ */
router.get("/", (req, res) => {
  res.json({ message: "Users route working ?" });
});

module.exports = router;
