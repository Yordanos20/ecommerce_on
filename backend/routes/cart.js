const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");
const { getCart, addToCart, updateCartItem, removeFromCart } = require("../controllers/cartControllers");

// GET - User's cart
router.get("/", auth, getCart);

// POST - Add to cart
router.post("/", auth, addToCart);

// PUT - Update quantity
router.put("/:productId", auth, updateCartItem);

// DELETE - Remove from cart
router.delete("/:productId", auth, removeFromCart);

module.exports = router;
