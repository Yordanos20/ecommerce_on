// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WishlistProvider } from "./context/WishlistContext";
import { SimpleWishlistProvider } from "./context/SimpleWishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import NavbarFixed from "./components/NavbarFixed";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import SellerLayout from "./components/SellerLayout";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import SellerRegister from "./pages/SellerRegister";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import TestPage from "./pages/TestPage";

// Customer Pages
import CustomerDashboardSimple from "./pages/CustomerDashboardSimple";
import Profile from "./pages/ProfileNew";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetailNew";
import SimpleCart from "./pages/SimpleCart";
import DirectCart from "./pages/DirectCart";
import BulletproofCart from "./pages/BulletproofCart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentVerify from "./pages/PaymentVerify";
import MockPayment from "./pages/MockPayment";
import OrderTrackingNew from "./pages/OrderTrackingNew";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardComplete from "./pages/admin/AdminDashboardComplete";
import UserManagement from "./pages/admin/UserManagement";
import SellerManagement from "./pages/admin/SellerManagement";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminSettings from "./pages/admin/AdminSettings";
import CategoryManagement from "./pages/admin/CategoryManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import AnalyticsManagement from "./pages/admin/AnalyticsManagement";
import NotificationsManagement from "./pages/admin/NotificationsManagement";
import SystemManagement from "./pages/admin/SystemManagement";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrdersSimple from "./pages/seller/SellerOrdersSimple";
import SellerProductsSimple from "./pages/seller/SellerProductsSimple";
import AddProduct from "./pages/seller/AddProduct";
import ProductCategoriesSimple from "./pages/seller/ProductCategoriesSimple";
import SellerAnalyticsSimple from "./pages/seller/SellerAnalyticsSimple";
import SellerPromotionsSimple from "./pages/seller/SellerPromotionsSimple";
import SellerReviewsSimple from "./pages/seller/SellerReviewsSimple";
import SellerEarningsSimple from "./pages/seller/SellerEarningsSimple";
import Inventory from "./pages/seller/Inventory";
import Payments from "./pages/seller/Payments";
import RevenueSimple from "./pages/seller/RevenueSimple";

// New Seller Dropdown Pages
import SellerProfile from "./pages/seller/SellerProfile";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerNotifications from "./pages/seller/SellerNotifications";
import SellerMessages from "./pages/seller/SellerMessages";
import SellerSupport from "./pages/seller/SellerSupport";
import SellerBilling from "./pages/seller/SellerBilling";

function LayoutWithNavbar({ darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <NavbarFixed darkMode={darkMode} setDarkMode={setDarkMode} />
      <Outlet />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function MainApp({ darkMode, setDarkMode }) {
  return (
    <Routes>
      {/* Admin Login - Outside main layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route element={<LayoutWithNavbar darkMode={darkMode} setDarkMode={setDarkMode} />}>
        {/* Public Routes */}
        <Route path="/" element={<Landing darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/seller/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/products" element={<Products darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/products/:id" element={<ProductDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/cart" element={<BulletproofCart />} />
        <Route path="/wishlist" element={<Wishlist darkMode={darkMode} setDarkMode={setDarkMode} />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<ProtectedRoute role="Customer"><Outlet /></ProtectedRoute>}>
          <Route index element={<CustomerDashboardSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="orders" element={<Orders darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="orders/:id/track" element={<OrderTrackingNew />} />
          <Route path="wishlist" element={<Wishlist darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="profile" element={<Profile darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />} />
          <Route path="products/:id" element={<ProductDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Route>
        <Route path="/checkout" element={<Checkout darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/payment/verify" element={<PaymentVerify />} />
        <Route path="/mock-payment" element={<MockPayment />} />

        {/* Seller Routes */}
        <Route path="/seller" element={<ProtectedRoute role="Seller"><SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>}>
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="orders" element={<SellerOrdersSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="inventory" element={<Inventory darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="payments" element={<Payments darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="revenue" element={<RevenueSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="analytics" element={<SellerAnalyticsSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="promotions" element={<SellerPromotionsSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="reviews" element={<SellerReviewsSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="earnings" element={<SellerEarningsSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="products" element={<SellerProductsSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="products/add" element={<AddProduct darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="products/categories" element={<ProductCategoriesSimple darkMode={darkMode} setDarkMode={setDarkMode} />} />

          {/* New Seller Dropdown Pages */}
          <Route path="profile" element={<SellerProfile darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="settings" element={<SellerSettings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="notifications" element={<SellerNotifications darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="messages" element={<SellerMessages darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="support" element={<SellerSupport darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="billing" element={<SellerBilling darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Route>
      </Route>

      {/* Admin Routes - Outside main layout */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} /></AdminProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboardComplete darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="users" element={<UserManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="sellers" element={<SellerManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="products" element={<AdminProducts darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="orders" element={<AdminOrders darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="revenue" element={<AdminRevenue darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="settings" element={<AdminSettings darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="categories" element={<CategoryManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="payments" element={<PaymentManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="content" element={<ContentManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="analytics" element={<AnalyticsManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="notifications" element={<NotificationsManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="settings" element={<SystemManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SimpleWishlistProvider>
            <MainApp darkMode={darkMode} setDarkMode={setDarkMode} />
          </SimpleWishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;