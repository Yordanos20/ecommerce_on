// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: ["https://ecommerceyo.netlify.app", "https://myecommerce-liart.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROUTE IMPORTS =================
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const cartRoutes = require("./routes/cart");
const categoryRoutes = require("./routes/categories");
const addressRoutes = require("./routes/addresses");
const paymentRoutes = require("./routes/payments");
const wishlistRoutes = require("./routes/wishlist");
const reviewRoutes = require("./routes/reviews");
const walletRoutes = require("./routes/wallet");
const productVariantRoutes = require("./routes/productVariants");
const chapaPaymentRoutes = require("./routes/chapaPayment");
const discountRoutes = require("./routes/discounts");
const shippingRoutes = require("./routes/shipping");
const returnRoutes = require("./routes/returns");
const notificationRoutes = require("./routes/notifications");
const newsletterRoutes = require("./routes/newsletter");
const supportRoutes = require("./routes/support");

// Dashboard routes
const sellerRoutes = require("./routes/seller");
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");

// ================= API ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/chapa-payment", chapaPaymentRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/support", supportRoutes);

// Dashboard routes
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

// ================= TEST ROUTE =================
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀", timestamp: new Date().toISOString() });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce Backend API is running!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      users: "/api/users",
      orders: "/api/orders",
      cart: "/api/cart",
      wishlist: "/api/wishlist"
    }
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? "Internal Server Error" : err.message,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});