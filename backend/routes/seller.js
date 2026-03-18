const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");
const role = require("../config/middleware/role");
const {
  getSellerDashboard,
  getSellerOrders,
  updateOrderStatus,
  getInventory,
  updateInventory,
  getPayments,
  getMonthlyRevenue,
  getTopProducts,
  getLowStockProducts,
} = require("../controllers/sellerControllers");

// Test route without authentication
router.get("/test", (req, res) => {
  res.json({ message: "Seller routes are working! 🚀" });
});

// Dashboard summary
router.get("/dashboard", auth, role(["seller"]), getSellerDashboard);

// Seller orders
router.get("/orders", auth, role(["seller"]), getSellerOrders);

// Update order status
router.put("/orders/:orderId/status", auth, role(["seller"]), updateOrderStatus);

// Get seller products
router.get("/inventory", auth, role(["seller"]), getInventory);

// Update stock
router.put("/inventory/:productId", auth, role(["seller"]), updateInventory);

// Payment tracking
router.get("/payments", auth, role(["seller"]), getPayments);

// Monthly revenue
router.get("/revenue", auth, role(["seller"]), getMonthlyRevenue);

// Top selling products
router.get("/top-products", auth, role(["seller"]), getTopProducts);

// Low stock products
router.get("/low-stock", auth, role(["seller"]), getLowStockProducts);

module.exports = router;
