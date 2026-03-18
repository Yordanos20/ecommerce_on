const db = require("../config/db");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// POST - Place order (customer)
exports.createOrder = async (req, res) => {
  try {
    console.log("Order request received:", req.body);
    console.log("User from token:", req.user);
    
    const customer_id = req.user.id;
    const { items, total_amount, shipping_address, payment_method, status } = req.body;

    console.log("Extracted data:", { customer_id, items, total_amount, shipping_address, payment_method, status });

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Cart is empty validation failed");
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderInsert = await query(
      "INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, ?)", 
      [
        customer_id,
        total_amount || 0,
        status || "pending"
      ]
    );
    const order_id = orderInsert.insertId;

    for (const item of items) {
      const productId = item.product_id;
      const quantity = Number(item.quantity || 1);

      const product = await query("SELECT price, seller_id FROM products WHERE id = ?", [productId]);
      if (product.length === 0) {
        return res.status(400).json({ error: `Product ${productId} not found` });
      }

      const price = Number(product[0].price || item.price || 0);
      const seller_id = product[0].seller_id || null;

      await query(
        "INSERT INTO order_items (order_id, product_id, quantity, price, seller_id) VALUES (?, ?, ?, ?, ?)",
        [order_id, productId, quantity, price, seller_id]
      );

      await query("UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?", [quantity, productId]);
    }

    if (shipping_address) {
      await query(
        "INSERT INTO shipping (order_id, address, city, state, zip, country, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          order_id, 
          shipping_address.address || "",
          shipping_address.city || "",
          shipping_address.state || "",
          shipping_address.zipCode || "",
          shipping_address.country || "",
          shipping_address.phone || "",
          shipping_address.email || ""
        ]
      );
    }

    // Create payment record
    await query(
      "INSERT INTO payments (order_id, payment_method, payment_status, amount) VALUES (?, ?, ?, ?)",
      [order_id, payment_method || "pending", "pending", total_amount || 0]
    );

    await query("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)", [
      customer_id,
      'Order Placed',
      `Order #${order_id} placed successfully! Total: $${total_amount}`,
      'order'
    ]);

    res.status(201).json({ 
      message: "Order created successfully", 
      id: order_id,
      total_amount: total_amount
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET - Role based orders
exports.getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const seller_id = req.user.sellerId;
    const role = String(req.user.role || "").toLowerCase();

    if (role === "customer") {
      const orders = await query(
        `SELECT o.*,
                (SELECT GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ')
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = o.id) AS items
         FROM orders o
         WHERE o.customer_id = ?
         ORDER BY o.created_at DESC`,
        [user_id]
      );
      return res.json(orders);
    }

    if (role === "admin") {
      const orders = await query(
        `SELECT o.*, u.name AS customer_name
         FROM orders o
         JOIN users u ON o.customer_id = u.id
         ORDER BY o.created_at DESC`
      );
      return res.json(orders);
    }

    if (role === "seller") {
      const orders = await query(
        `SELECT DISTINCT o.*, u.name AS customer_name
         FROM orders o
         JOIN users u ON o.customer_id = u.id
         JOIN order_items oi ON o.id = oi.order_id
         WHERE oi.seller_id = ?
         ORDER BY o.created_at DESC`,
        [seller_id || user_id]
      );
      return res.json(orders);
    }

    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - New/pending orders (for seller/admin)
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await query(
      "SELECT * FROM orders WHERE status = 'Pending' ORDER BY created_at DESC"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - Revenue stats (for seller/admin)
exports.getRevenueStats = async (req, res) => {
  try {
    const sellerId = req.query.sellerId || req.user.sellerId || req.user.id;
    const role = String(req.user.role || "").toLowerCase();

    let sql = "";
    let values = [];

    if (role === "admin") {
      sql = `SELECT SUM(oi.quantity * oi.price) AS total, DATE(o.created_at) AS date
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             WHERE o.status = 'Delivered'
             GROUP BY DATE(o.created_at)
             ORDER BY DATE(o.created_at)`;
    } else {
      sql = `SELECT SUM(oi.quantity * oi.price) AS total, DATE(o.created_at) AS date
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             WHERE oi.seller_id = ? AND o.status = 'Delivered'
             GROUP BY DATE(o.created_at)
             ORDER BY DATE(o.created_at)`;
      values = [sellerId];
    }

    const rows = await query(sql, values);

    const today = new Date().toISOString().split("T")[0];
    const daily = rows.find((r) => r.date === today)?.total || 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekly = rows
      .filter((r) => new Date(r.date) >= weekAgo)
      .reduce((sum, r) => sum + Number(r.total || 0), 0);

    const monthly = rows.reduce((sum, r) => sum + Number(r.total || 0), 0);

    res.json({
      daily: Number(daily).toFixed(2),
      weekly: Number(weekly).toFixed(2),
      monthly: Number(monthly).toFixed(2),
      dailyTrend: rows.slice(-7).map((r) => ({
        day: r.date,
        revenue: Number(r.total || 0),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message, daily: 0, weekly: 0, monthly: 0, dailyTrend: [] });
  }
};
