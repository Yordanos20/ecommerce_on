const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");

const db = require("../config/db");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Get variants for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    const variants = await query(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_name, variant_value",
      [productId]
    );

    // Group variants by type
    const groupedVariants = {};
    variants.forEach(variant => {
      if (!groupedVariants[variant.variant_name]) {
        groupedVariants[variant.variant_name] = [];
      }
      groupedVariants[variant.variant_name].push({
        id: variant.id,
        value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
        stock: variant.stock
      });
    });

    res.json(groupedVariants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add variant to product (Seller/Admin only)
router.post("/product/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant_name, variant_value, price_adjustment, stock } = req.body;

    if (!variant_name || !variant_value) {
      return res.status(400).json({ error: "Variant name and value are required" });
    }

    // Check if user owns the product
    const product = await query("SELECT seller_id FROM products WHERE id = ?", [productId]);
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == product[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const result = await query(
      "INSERT INTO product_variants (product_id, variant_name, variant_value, price_adjustment, stock) VALUES (?, ?, ?, ?, ?)",
      [productId, variant_name, variant_value, price_adjustment || 0, stock || 0]
    );

    res.status(201).json({ 
      message: "Variant added successfully",
      variantId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update variant (Seller/Admin only)
router.put("/:variantId", auth, async (req, res) => {
  try {
    const { variantId } = req.params;
    const { variant_value, price_adjustment, stock } = req.body;

    // Get variant with product info
    const variant = await query(
      `SELECT pv.*, p.seller_id 
       FROM product_variants pv 
       JOIN products p ON pv.product_id = p.id 
       WHERE pv.id = ?`,
      [variantId]
    );

    if (variant.length === 0) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == variant[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query(
      "UPDATE product_variants SET variant_value = ?, price_adjustment = ?, stock = ? WHERE id = ?",
      [variant_value, price_adjustment, stock, variantId]
    );

    res.json({ message: "Variant updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete variant (Seller/Admin only)
router.delete("/:variantId", auth, async (req, res) => {
  try {
    const { variantId } = req.params;

    // Get variant with product info
    const variant = await query(
      `SELECT pv.*, p.seller_id 
       FROM product_variants pv 
       JOIN products p ON pv.product_id = p.id 
       WHERE pv.id = ?`,
      [variantId]
    );

    if (variant.length === 0) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == variant[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query("DELETE FROM product_variants WHERE id = ?", [variantId]);

    res.json({ message: "Variant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get variant stock
router.get("/:variantId/stock", async (req, res) => {
  try {
    const { variantId } = req.params;
    
    const variant = await query(
      "SELECT stock FROM product_variants WHERE id = ?",
      [variantId]
    );

    if (variant.length === 0) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({ stock: variant[0].stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update variant stock (Seller/Admin only)
router.patch("/:variantId/stock", auth, async (req, res) => {
  try {
    const { variantId } = req.params;
    const { stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({ error: "Stock cannot be negative" });
    }

    // Get variant with product info
    const variant = await query(
      `SELECT pv.*, p.seller_id 
       FROM product_variants pv 
       JOIN products p ON pv.product_id = p.id 
       WHERE pv.id = ?`,
      [variantId]
    );

    if (variant.length === 0) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == variant[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query(
      "UPDATE product_variants SET stock = ? WHERE id = ?",
      [stock, variantId]
    );

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
