// backend/routes/reviews.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Get reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';
    const rating = req.query.rating;

    let whereClause = "WHERE r.product_id = ?";
    let queryParams = [req.params.productId];

    if (rating) {
      whereClause += " AND r.rating = ?";
      queryParams.push(rating);
    }

    const validSortFields = ['created_at', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const rows = await query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.${sortField} ${sortDirection}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM reviews r ${whereClause}`,
      queryParams
    );

    // Calculate average rating
    const avgResult = await query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?",
      [req.params.productId]
    );

    // Get rating distribution
    const distribution = await query(
      `SELECT rating, COUNT(*) as count 
       FROM reviews 
       WHERE product_id = ? 
       GROUP BY rating 
       ORDER BY rating DESC`,
      [req.params.productId]
    );

    res.json({
      reviews: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
        totalReviews: countResult[0].total,
        limit
      },
      averageRating: parseFloat(avgResult[0].avg_rating || 0).toFixed(1),
      totalReviews: avgResult[0].total_reviews,
      ratingDistribution: distribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews by the logged-in user ✅ NEW
router.get("/user", auth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT r.id, r.product_id, r.rating, r.comment, r.created_at,
              p.name AS product_name, p.image AS product_image
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add review
router.post("/", auth, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: "product_id and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user has purchased the product
    const purchaseCheck = await query(
      `SELECT oi.id FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.product_id = ? AND o.customer_id = ? AND o.status IN ('Delivered', 'Processing')`,
      [product_id, req.user.id]
    );

    if (purchaseCheck.length === 0) {
      return res.status(403).json({ error: "You can only review products you have purchased" });
    }

    // Check if review already exists
    const existingReview = await query(
      "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
      [product_id, req.user.id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    await query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [product_id, req.user.id, rating, comment || ""]
    );

    // Update product rating
    await query(
      `UPDATE products SET rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE product_id = ?
      ) WHERE id = ?`,
      [product_id, product_id]
    );

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete review
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await query("SELECT user_id, product_id FROM reviews WHERE id = ?", [req.params.id]);

    if (review.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const isAdmin = String(req.user.role).toLowerCase() === "admin";
    if (!isAdmin && Number(review[0].user_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query("DELETE FROM reviews WHERE id = ?", [req.params.id]);

    // Update product rating
    await query(
      `UPDATE products SET rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE product_id = ?
      ) WHERE id = ?`,
      [review[0].product_id, review[0].product_id]
    );

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update review
router.put("/:id", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review = await query("SELECT user_id, product_id FROM reviews WHERE id = ?", [req.params.id]);

    if (review.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (Number(review[0].user_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
      [rating, comment || "", req.params.id]
    );

    // Update product rating
    await query(
      `UPDATE products SET rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE product_id = ?
      ) WHERE id = ?`,
      [review[0].product_id, review[0].product_id]
    );

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get seller reviews (for sellers to see reviews of their products)
router.get("/seller/reviews", auth, async (req, res) => {
  try {
    if (req.user.role !== 'Seller' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: "Seller or Admin access required" });
    }

    const sellerId = req.user.sellerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const reviews = await query(
      `SELECT r.*, u.name AS user_name, p.name AS product_name, p.image AS product_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN products p ON r.product_id = p.id
       WHERE p.seller_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [sellerId, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE p.seller_id = ?`,
      [sellerId]
    );

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
        total: countResult[0].total,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;