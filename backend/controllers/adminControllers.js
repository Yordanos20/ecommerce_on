const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const results = await query("SELECT * FROM users WHERE email = ? AND LOWER(role) = 'admin'", [email]);
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Notifications
exports.getNotifications = async (req, res) => {
  try {
    console.log("Notifications request received from user:", req.user?.id, req.user?.role);
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Get recent notifications from database
    const notifications = [];
    
    // Recent orders
    const recentOrders = await query(`
      SELECT o.id, o.total_price, o.status, o.created_at,
             u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    recentOrders.forEach((order, index) => {
      notifications.push({
        id: `order-${order.id}`,
        type: 'order',
        title: 'New Order Received',
        message: `Order #${order.id} - ${order.customer_name || order.customer_email} - $${order.total_price}`,
        time: order.created_at,
        read: false,
        icon: 'shopping-cart',
        color: 'blue',
        orderId: order.id // Add order ID for redirect
      });
    });

    // Pending sellers
    const pendingSellers = await query(`
      SELECT COUNT(*) as count FROM users 
      WHERE LOWER(role)='seller' AND is_active = 0
    `);

    if (pendingSellers[0].count > 0) {
      notifications.push({
        id: 'sellers-pending',
        type: 'seller',
        title: 'Pending Seller Applications',
        message: `${pendingSellers[0].count} sellers awaiting approval`,
        time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        icon: 'package',
        color: 'green'
      });
    }

    // Recent users
    const recentUsers = await query(`
      SELECT id, name, email, created_at FROM users 
      WHERE LOWER(role)='customer'
      ORDER BY created_at DESC
      LIMIT 3
    `);

    recentUsers.forEach(user => {
      notifications.push({
        id: `user-${user.id}`,
        type: 'user',
        title: 'New User Registration',
        message: `${user.name || user.email} joined as a customer`,
        time: user.created_at,
        read: false,
        icon: 'users',
        color: 'purple',
        userId: user.id // Add user ID for redirect
      });
    });

    // Recent sellers
    const recentSellers = await query(`
      SELECT id, name, email, created_at FROM users 
      WHERE LOWER(role)='seller'
      ORDER BY created_at DESC
      LIMIT 3
    `);

    recentSellers.forEach(seller => {
      notifications.push({
        id: `seller-${seller.id}`,
        type: 'seller',
        title: 'New Seller Registration',
        message: `${seller.name || seller.email} joined as a seller`,
        time: seller.created_at,
        read: false,
        icon: 'briefcase',
        color: 'orange',
        sellerId: seller.id // Add seller ID for redirect
      });
    });

    // Low stock products
    const lowStockProducts = await query(`
      SELECT id, name, stock FROM products 
      WHERE stock < 10
      LIMIT 5
    `);

    if (lowStockProducts.length > 0) {
      notifications.push({
        id: 'low-stock',
        type: 'alert',
        title: 'Low Stock Alert',
        message: `${lowStockProducts.length} products running low on stock`,
        time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: false,
        icon: 'alert-triangle',
        color: 'yellow',
        products: lowStockProducts.map(p => p.id) // Add product IDs for potential redirects
      });
    }

    console.log('Notifications fetched:', notifications.length);
    res.json({ notifications });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Admin Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    console.log("Dashboard request received from user:", req.user?.id, req.user?.role);
    
    // Basic counts - try different possible table/column names
    console.log('=== DASHBOARD API CALLED ===');
    
    // Try different user table queries
    let users, sellers, customers, pendingSellers;
    
    try {
      users = await query("SELECT COUNT(*) AS totalUsers FROM users");
    } catch (e) {
      try {
        users = await query("SELECT COUNT(*) AS totalUsers FROM user");
      } catch (e2) {
        users = [{ totalUsers: 0 }];
      }
    }
    
    try {
      sellers = await query("SELECT COUNT(*) AS totalSellers FROM users WHERE LOWER(role)='seller'");
    } catch (e) {
      try {
        sellers = await query("SELECT COUNT(*) AS totalSellers FROM users WHERE LOWER(role)='Seller'");
      } catch (e2) {
        try {
          sellers = await query("SELECT COUNT(*) AS totalSellers FROM users WHERE role='seller'");
        } catch (e3) {
          sellers = [{ totalSellers: 0 }];
        }
      }
    }
    
    try {
      customers = await query("SELECT COUNT(*) AS totalCustomers FROM users WHERE LOWER(role)='customer'");
    } catch (e) {
      try {
        customers = await query("SELECT COUNT(*) AS totalCustomers FROM users WHERE LOWER(role)='Customer'");
      } catch (e2) {
        try {
          customers = await query("SELECT COUNT(*) AS totalCustomers FROM users WHERE role='customer'");
        } catch (e3) {
          customers = [{ totalCustomers: 0 }];
        }
      }
    }
    
    try {
      pendingSellers = await query("SELECT COUNT(*) AS pendingSellers FROM users WHERE LOWER(role)='seller' AND is_active = 0");
    } catch (e) {
      try {
        pendingSellers = await query("SELECT COUNT(*) AS pendingSellers FROM users WHERE LOWER(role)='seller' AND status = 'pending'");
      } catch (e2) {
        try {
          pendingSellers = await query("SELECT COUNT(*) AS pendingSellers FROM users WHERE LOWER(role)='seller' AND approved = 0");
        } catch (e3) {
          pendingSellers = [{ pendingSellers: 0 }];
        }
      }
    }
    
    // Orders queries
    let orders, revenue, pendingOrders;
    
    try {
      orders = await query("SELECT COUNT(*) AS totalOrders FROM orders");
    } catch (e) {
      orders = [{ totalOrders: 0 }];
    }
    
    try {
      revenue = await query("SELECT SUM(total_price) AS totalRevenue FROM orders WHERE status != 'cancelled'");
    } catch (e) {
      try {
        revenue = await query("SELECT SUM(total) AS totalRevenue FROM orders WHERE status != 'cancelled'");
      } catch (e2) {
        try {
          revenue = await query("SELECT SUM(price) AS totalRevenue FROM orders WHERE status != 'cancelled'");
        } catch (e3) {
          revenue = [{ totalRevenue: 0 }];
        }
      }
    }
    
    try {
      pendingOrders = await query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'");
    } catch (e) {
      try {
        pendingOrders = await query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE LOWER(status) = 'pending'");
      } catch (e2) {
        pendingOrders = [{ pendingOrders: 0 }];
      }
    }
    
    console.log('Final counts:', { users, sellers, customers, orders, revenue, pendingOrders, pendingSellers });
    
    // Recent orders with customer info
    const recentOrders = await query(`
      SELECT o.id, o.total_price, o.status, o.created_at,
             u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    
    // Recent users
    const recentUsers = await query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    // Top products
    const topProducts = await query(`
      SELECT p.id, p.name, p.price, 
             SUM(oi.quantity) as total_sold,
             SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    
    // Top categories (simplified)
    const topCategories = await query(`
      SELECT category, 
             COUNT(*) as product_count
      FROM products
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY product_count DESC
      LIMIT 5
    `);
    
    // Sales trend (last 6 months)
    const salesTrend = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total_price) as sales,
        COUNT(*) as order_count
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        AND status != 'cancelled'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    
    // Format trend data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthData = salesTrend.find(t => t.month === monthKey);
      trend.push({
        month: monthNames[date.getMonth()],
        sales: monthData?.sales || 0,
        orders: monthData?.order_count || 0
      });
    }
    
    // Recent activity (orders, new users, etc.)
    const recentActivity = [];
    
    // Add recent orders to activity
    recentOrders.forEach(order => {
      recentActivity.push({
        type: 'order',
        description: `New order #${order.id} by ${order.customer_name}`,
        amount: order.total_price,
        status: order.status,
        created_at: order.created_at
      });
    });
    
    // Add recent users to activity
    recentUsers.forEach(user => {
      recentActivity.push({
        type: 'user',
        description: `New ${user.role} registered: ${user.name}`,
        created_at: user.created_at
      });
    });
    
    // Sort activity by date
    recentActivity.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // System info - temporarily simplified to avoid totalSize error
    console.log('=== DASHBOARD API CALLED ===');
    const systemInfo = [];
    const validTotalSize = 0; // Temporarily hardcoded to avoid error
    console.log('validTotalSize:', validTotalSize, 'type:', typeof validTotalSize);

    const response = {
      overview: {
        totalUsers: users[0]?.totalUsers || 0,
        totalSellers: sellers[0]?.totalSellers || 0,
        totalCustomers: customers[0]?.totalCustomers || 0,
        totalOrders: orders[0]?.totalOrders || 0,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        pendingOrders: pendingOrders[0]?.pendingOrders || 0,
        pendingSellers: pendingSellers[0]?.pendingSellers || 0
      },
      trend: trend,
      recentOrders: recentOrders,
      recentUsers: recentUsers,
      topProducts: topProducts,
      topCategories: topCategories,
      recentActivity: recentActivity.slice(0, 10),
      system: {
        databaseSize: "0.0 MB",
        tableCount: 0
      }
    };
    
    console.log('=== DASHBOARD API SUCCESS ===');
    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Users
exports.getAllUsers = async (req, res) => {
  try {
    const results = await query(
      `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
              COUNT(DISTINCT o.id) as total_orders,
              SUM(o.total_price) as total_spent,
              MAX(o.created_at) as last_order_date
       FROM users u
       LEFT JOIN orders o ON u.id = o.customer_id
       GROUP BY u.id, u.name, u.email, u.role, u.is_active, u.created_at
       ORDER BY u.created_at DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await query("UPDATE users SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, id]);
    res.json({ message: "User status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sellers
exports.getAllSellers = async (req, res) => {
  try {
    const rows = await query(
      `SELECT s.id, s.user_id, u.name, u.email, s.store_name, s.business_id, s.approval_status, s.created_at,
              COUNT(DISTINCT p.id) as total_products,
              COUNT(DISTINCT oi.order_id) as total_orders,
              SUM(oi.quantity * oi.price) as total_revenue,
              MAX(o.created_at) as last_order_date
       FROM sellers s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN products p ON s.id = p.seller_id
       LEFT JOIN order_items oi ON s.id = oi.seller_id
       LEFT JOIN orders o ON oi.order_id = o.id
       GROUP BY s.id, s.user_id, u.name, u.email, s.store_name, s.business_id, s.approval_status, s.created_at
       ORDER BY s.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSellerApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approval_status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(approval_status)) {
      return res.status(400).json({ error: "Invalid approval status" });
    }

    await query("UPDATE sellers SET approval_status = ? WHERE id = ?", [approval_status, id]);
    res.json({ message: "Seller status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Products
exports.getAllProducts = async (req, res) => {
  try {
    const rows = await query(
      `SELECT p.id, p.name, p.price, p.stock, p.created_at, p.isNew, p.isSale, p.description,
              c.name AS category, u.name AS seller_name, p.seller_id
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN sellers s ON p.seller_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Orders
exports.getAllOrders = async (req, res) => {
  try {
    const rows = await query(
      `SELECT o.id, o.customer_id, u.name AS customer_name, u.email AS customer_email, o.total_price, o.status, o.created_at
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search functionality
exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.json([]);
    }
    
    const results = await query(
      `SELECT id, name, email, role, is_active, created_at,
              COUNT(DISTINCT o.id) as total_orders,
              SUM(o.total_price) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.customer_id
       WHERE u.name LIKE ? OR u.email LIKE ? OR u.id LIKE ?
       GROUP BY u.id, u.name, u.email, u.role, u.is_active, u.created_at
       ORDER BY u.name
       LIMIT 20`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.json([]);
    }
    
    const results = await query(
      `SELECT p.id, p.name, p.price, p.stock, p.description, p.created_at,
              c.name AS category, u.name AS seller_name, p.seller_id
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN sellers s ON p.seller_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE p.name LIKE ? OR p.description LIKE ? OR p.id LIKE ?
       ORDER BY p.name
       LIMIT 20`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchOrders = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.json([]);
    }
    
    const results = await query(
      `SELECT o.id, o.customer_id, u.name AS customer_name, u.email AS customer_email, 
              o.total_price, o.status, o.created_at
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR o.total_price LIKE ?
       ORDER BY o.created_at DESC
       LIMIT 20`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchSellers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.json([]);
    }
    
    const results = await query(
      `SELECT s.id, s.user_id, u.name, u.email, s.store_name, s.business_id, 
              s.approval_status, s.created_at,
              COUNT(DISTINCT p.id) as total_products,
              COUNT(DISTINCT oi.order_id) as total_orders,
              SUM(oi.quantity * oi.price) as total_revenue
       FROM sellers s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN products p ON s.id = p.seller_id
       LEFT JOIN order_items oi ON s.id = oi.seller_id
       WHERE s.store_name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR s.business_id LIKE ?
       GROUP BY s.id, s.user_id, u.name, u.email, s.store_name, s.business_id, s.approval_status, s.created_at
       ORDER BY s.store_name
       LIMIT 20`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status for admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
