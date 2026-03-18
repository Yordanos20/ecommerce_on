const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productControllers");

// GET all products
router.get("/", getProducts);

// GET single product by ID
router.get("/:id", getProductById);

// POST new product (Seller/Admin)
router.post("/", auth, createProduct);

// PUT update product (Seller/Admin)
router.put("/:id", auth, updateProduct);

// DELETE product (Seller/Admin)
router.delete("/:id", auth, deleteProduct);

module.exports = router;