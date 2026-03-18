// Simplified Admin Dashboard Controller
const db = require("../config/db");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
  });

// Simple Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    console.log("Simple dashboard request received from user:", req.user?.id, req.user?.role);
    
    // Basic counts with error handling
    let totalUsers = 0;
    let totalSellers = 0;
    let totalCustomers = 0;
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let pendingSellers = 0;
    
    try {
      const userResult = await query("SELECT COUNT(*) AS totalUsers FROM users");
      totalUsers = userResult[0]?.totalUsers || 0;
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
    
    try {
      const sellerResult = await query("SELECT COUNT(*) AS totalSellers FROM users WHERE LOWER(role)='seller'");
      totalSellers = sellerResult[0]?.totalSellers || 0;
    } catch (err) {
      console.error("Error fetching sellers:", err.message);
    }
    
    try {
      const customerResult = await query("SELECT COUNT(*) AS totalCustomers FROM users WHERE LOWER(role)='customer'");
      totalCustomers = customerResult[0]?.totalCustomers || 0;
    } catch (err) {
      console.error("Error fetching customers:", err.message);
    }
    
    try {
      const orderResult = await query("SELECT COUNT(*) AS totalOrders FROM orders");
      totalOrders = orderResult[0]?.totalOrders || 0;
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
    
    try {
      const revenueResult = await query("SELECT COALESCE(SUM(total_price), 0) AS totalRevenue FROM orders WHERE status != 'cancelled'");
      totalRevenue = revenueResult[0]?.totalRevenue || 0;
    } catch (err) {
      console.error("Error fetching revenue:", err.message);
    }
    
    try {
      const pendingResult = await query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'");
      pendingOrders = pendingResult[0]?.pendingOrders || 0;
    } catch (err) {
      console.error("Error fetching pending orders:", err.message);
    }
    
    try {
      const pendingSellerResult = await query("SELECT COUNT(*) AS pendingSellers FROM users WHERE LOWER(role)='seller' AND is_active = 0");
      pendingSellers = pendingSellerResult[0]?.pendingSellers || 0;
    } catch (err) {
      console.error("Error fetching pending sellers:", err.message);
    }
    
    // Simple recent orders
    let recentOrders = [];
    try {
      const recentOrdersResult = await query(`
        SELECT o.id, o.total_price, o.status, o.created_at,
               u.name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `);
      recentOrders = recentOrdersResult || [];
    } catch (err) {
      console.error("Error fetching recent orders:", err.message);
    }
    
    // Simple recent users
    let recentUsers = [];
    try {
      const recentUsersResult = await query(`
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);
      recentUsers = recentUsersResult || [];
    } catch (err) {
      console.error("Error fetching recent users:", err.message);
    }
    
    // Simple system info
    const systemInfo = {
      databaseSize: "Unknown",
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };

    const response = {
      overview: {
        totalUsers,
        totalSellers,
        totalCustomers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        pendingSellers
      },
      recentOrders,
      recentUsers,
      system: systemInfo
    };

    console.log("Simple dashboard response:", response);
    res.json(response);
    
  } catch (err) {
    console.error("Simple dashboard error:", err);
    res.status(500).json({ 
      error: "Failed to load dashboard data: " + err.message 
    });
  }
};
