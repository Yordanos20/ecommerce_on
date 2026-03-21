// backend/routes/users.js

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  getMe,
  updatePassword,
  testUser,
  createSeller,
  bypassLogin,
  minimalTest,
} = require("../controllers/authControllers");
const auth = require("../config/middleware/auth");

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Test user existence
router.post("/test", testUser);

// Create seller user
router.post("/create-seller", createSeller);

// Bypass login for testing
router.post("/bypass-login", bypassLogin);

// Minimal test - bypass everything
router.post("/minimal-test", minimalTest);

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
