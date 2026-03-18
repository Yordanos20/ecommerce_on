const db = require("../config/db");

// Dashboard summary
exports.getSellerDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [products] = await db.promise().query(
      "SELECT COUNT(*) AS totalProducts FROM products WHERE seller_id = ?",
      [sellerId]
    );

    const [orders] = await db.promise().query(
      "SELECT COUNT(DISTINCT order_id) AS totalOrders FROM order_items WHERE seller_id = ?",
      [sellerId]
    );

    const [revenue] = await db.promise().query(
      "SELECT SUM(quantity * price) AS totalRevenue FROM order_items WHERE seller_id = ?",
      [sellerId]
    );

    const [pending] = await db.promise().query(
      `SELECT COUNT(*) AS pendingOrders
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.seller_id = ? AND o.status = 'Pending'`,
      [sellerId]
    );

    res.json({
      totalProducts: products[0].totalProducts || 0,
      totalOrders: orders[0].totalOrders || 0,
      totalRevenue: revenue[0].totalRevenue || 0,
      pendingOrders: pending[0].pendingOrders || 0,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Seller orders list
exports.getSellerOrders = async (req, res) => {
  const userId = req.user.id;
  const limit = Math.min(Number(req.query.limit || 50), 100);

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [orders] = await db.promise().query(
      `SELECT o.id AS orderId,
              u.name AS customerName,
              SUM(oi.quantity * oi.price) AS total,
              o.status,
              o.created_at AS date
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       JOIN order_items oi ON o.id = oi.order_id
       WHERE oi.seller_id = ?
       GROUP BY o.id, u.name, o.status, o.created_at
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [sellerId, limit]
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [result] = await db.promise().query(
      `UPDATE orders o
       JOIN order_items oi ON o.id = oi.order_id
       SET o.status = ?
       WHERE o.id = ? AND oi.seller_id = ?`,
      [status, orderId, sellerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get seller products (inventory)
exports.getInventory = async (req, res) => {
  const userId = req.user.id;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [products] = await db
      .promise()
      .query("SELECT id, name, stock, price FROM products WHERE seller_id = ?", [sellerId]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update stock
exports.updateInventory = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { stock, price } = req.body;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [result] = await db
      .promise()
      .query("UPDATE products SET stock = ?, price = ? WHERE id = ? AND seller_id = ?", [
        stock,
        price,
        productId,
        sellerId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Payments
exports.getPayments = async (req, res) => {
  const userId = req.user.id;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [payments] = await db.promise().query(
      `SELECT p.id,
              p.order_id AS orderId,
              p.amount,
              p.payment_method AS paymentMethod,
              p.payment_status AS paymentStatus,
              p.created_at
       FROM payments p
       JOIN order_items oi ON p.order_id = oi.order_id
       WHERE oi.seller_id = ?
       GROUP BY p.id, p.order_id, p.amount, p.payment_method, p.payment_status, p.created_at
       ORDER BY p.created_at DESC`,
      [sellerId]
    );

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Monthly Revenue for chart
exports.getMonthlyRevenue = async (req, res) => {
  const userId = req.user.id;

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [data] = await db.promise().query(
      `SELECT MONTH(o.created_at) AS month,
              SUM(oi.quantity * oi.price) AS revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.seller_id = ?
       GROUP BY MONTH(o.created_at)
       ORDER BY MONTH(o.created_at)`,
      [sellerId]
    );

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = monthNames.map((name, index) => {
      const monthData = data.find((d) => d.month === index + 1);
      return { month: name, revenue: monthData ? Number(monthData.revenue) : 0 };
    });

    res.json(revenueData);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get top selling products
exports.getTopProducts = async (req, res) => {
  const userId = req.user.id;
  const limit = Math.min(Number(req.query.limit || 5), 10);

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [topProducts] = await db.promise().query(
      `SELECT p.id, p.name, p.price,
              SUM(oi.quantity) AS totalSold,
              SUM(oi.quantity * oi.price) AS totalRevenue,
              COUNT(DISTINCT oi.order_id) AS orderCount
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       WHERE p.seller_id = ?
       GROUP BY p.id, p.name, p.price
       ORDER BY totalRevenue DESC
       LIMIT ?`,
      [sellerId, limit]
    );

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  const userId = req.user.id;
  const threshold = Number(req.query.threshold || 10);

  try {
    // First get the seller ID from the users table
    const [sellerResult] = await db.promise().query(
      "SELECT id FROM sellers WHERE user_id = ?",
      [userId]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const sellerId = sellerResult[0].id;

    const [lowStockProducts] = await db.promise().query(
      `SELECT id, name, stock, price
       FROM products
       WHERE seller_id = ? AND stock <= ?
       ORDER BY stock ASC`,
      [sellerId, threshold]
    );

    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
