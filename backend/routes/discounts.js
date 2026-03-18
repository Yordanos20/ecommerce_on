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

// Get all active discounts
router.get("/active", async (req, res) => {
  try {
    const discounts = await query(
      `SELECT d.*, p.name as product_name, p.price as product_price,
              s.store_name, c.name as category_name
       FROM discounts d
       LEFT JOIN products p ON d.product_id = p.id
       LEFT JOIN sellers s ON d.seller_id = s.id
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.is_active = 1 AND d.start_date <= NOW() AND d.end_date >= NOW()
       ORDER BY d.created_at DESC`,
      []
    );

    res.json(discounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get discounts for a specific seller
router.get("/seller/:sellerId", auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Check if user is authorized (seller or admin)
    if (req.user.role !== 'Admin' && !(req.user.sellerId && req.user.sellerId == sellerId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const discounts = await query(
      `SELECT d.*, p.name as product_name, p.price as product_price,
              c.name as category_name
       FROM discounts d
       LEFT JOIN products p ON d.product_id = p.id
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.seller_id = ?
       ORDER BY d.created_at DESC`,
      [sellerId]
    );

    res.json(discounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new discount (Seller/Admin only)
router.post("/", auth, async (req, res) => {
  try {
    const { 
      discount_type, discount_value, product_id, category_id, 
      start_date, end_date, min_purchase_amount, usage_limit 
    } = req.body;

    if (!discount_type || !discount_value || !start_date || !end_date) {
      return res.status(400).json({ 
        error: "Discount type, value, start date, and end date are required" 
      });
    }

    let sellerId = null;

    // If creating product-specific discount, verify ownership
    if (product_id) {
      const product = await query("SELECT seller_id FROM products WHERE id = ?", [product_id]);
      if (product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (req.user.role !== 'Admin' && 
          !(req.user.role === 'Seller' && req.user.sellerId == product[0].seller_id)) {
        return res.status(403).json({ error: "Not authorized to create discount for this product" });
      }
      sellerId = product[0].seller_id;
    } else if (req.user.role === 'Seller') {
      sellerId = req.user.sellerId;
    }

    const result = await query(
      `INSERT INTO discounts 
       (discount_type, discount_value, product_id, category_id, seller_id, 
        start_date, end_date, min_purchase_amount, usage_limit, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        discount_type, discount_value, product_id, category_id, sellerId,
        start_date, end_date, min_purchase_amount || 0, usage_limit || null
      ]
    );

    res.status(201).json({ 
      message: "Discount created successfully",
      discountId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update discount (Seller/Admin only)
router.put("/:discountId", auth, async (req, res) => {
  try {
    const { discountId } = req.params;
    const { 
      discount_type, discount_value, start_date, end_date, 
      min_purchase_amount, usage_limit, is_active 
    } = req.body;

    // Get discount with seller info
    const discount = await query(
      "SELECT * FROM discounts WHERE id = ?",
      [discountId]
    );

    if (discount.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == discount[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query(
      `UPDATE discounts SET 
       discount_type = ?, discount_value = ?, start_date = ?, end_date = ?,
       min_purchase_amount = ?, usage_limit = ?, is_active = ?
       WHERE id = ?`,
      [
        discount_type, discount_value, start_date, end_date,
        min_purchase_amount, usage_limit, is_active, discountId
      ]
    );

    res.json({ message: "Discount updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete discount (Seller/Admin only)
router.delete("/:discountId", auth, async (req, res) => {
  try {
    const { discountId } = req.params;

    // Get discount with seller info
    const discount = await query(
      "SELECT * FROM discounts WHERE id = ?",
      [discountId]
    );

    if (discount.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && 
        !(req.user.role === 'Seller' && req.user.sellerId == discount[0].seller_id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query("DELETE FROM discounts WHERE id = ?", [discountId]);

    res.json({ message: "Discount deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Apply discount to cart/order
router.post("/apply", auth, async (req, res) => {
  try {
    const { discount_code, cart_total } = req.body;

    if (!discount_code || !cart_total) {
      return res.status(400).json({ error: "Discount code and cart total are required" });
    }

    // Find discount by code
    const discounts = await query(
      `SELECT * FROM discounts 
       WHERE discount_code = ? AND is_active = 1 
       AND start_date <= NOW() AND end_date >= NOW()`,
      [discount_code]
    );

    if (discounts.length === 0) {
      return res.status(404).json({ error: "Invalid or expired discount code" });
    }

    const discount = discounts[0];

    // Check minimum purchase amount
    if (discount.min_purchase_amount > cart_total) {
      return res.status(400).json({ 
        error: `Minimum purchase amount of ${discount.min_purchase_amount} required` 
      });
    }

    // Check usage limit
    if (discount.usage_limit) {
      const usageCount = await query(
        "SELECT COUNT(*) as used FROM discount_usage WHERE discount_id = ?",
        [discount.id]
      );

      if (usageCount[0].used >= discount.usage_limit) {
        return res.status(400).json({ error: "Discount usage limit reached" });
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = (cart_total * discount.discount_value) / 100;
    } else {
      discountAmount = discount.discount_value;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cart_total);

    res.json({
      discountId: discount.id,
      discountAmount: discountAmount,
      finalTotal: cart_total - discountAmount,
      discountType: discount.discount_type,
      discountValue: discount.discount_value
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Record discount usage
router.post("/use", auth, async (req, res) => {
  try {
    const { discount_id, order_id } = req.body;

    if (!discount_id || !order_id) {
      return res.status(400).json({ error: "Discount ID and Order ID are required" });
    }

    // Record usage
    await query(
      "INSERT INTO discount_usage (discount_id, order_id, user_id) VALUES (?, ?, ?)",
      [discount_id, order_id, req.user.id]
    );

    res.json({ message: "Discount usage recorded successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
