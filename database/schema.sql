-- E-COMMERCE MARKETPLACE DATABASE SCHEMA
-- Run this in MySQL to create/update your database

DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;
USE ecommerce;

-- ========================================
-- USERS & AUTH
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Customer', 'Seller', 'Admin') DEFAULT 'Customer',
  profile_image VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  email_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- SELLERS
-- ========================================
CREATE TABLE IF NOT EXISTS sellers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  store_name VARCHAR(100) NOT NULL,
  store_description TEXT DEFAULT NULL,
  store_logo VARCHAR(500) DEFAULT NULL,
  business_id VARCHAR(50),
  business_address TEXT DEFAULT NULL,
  approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- CATEGORIES & SUBCATEGORIES
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  image VARCHAR(500) DEFAULT NULL,
  parent_id INT DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ========================================
-- BRANDS
-- ========================================
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  logo VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PRODUCTS
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) DEFAULT NULL,
  description TEXT,
  short_description VARCHAR(500) DEFAULT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2) DEFAULT NULL,
  stock INT DEFAULT 0,
  sku VARCHAR(50) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  brand_id INT DEFAULT NULL,
  seller_id INT DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  weight DECIMAL(8,2) DEFAULT NULL,
  dimensions VARCHAR(100) DEFAULT NULL,
  isNew TINYINT(1) DEFAULT 0,
  isSale TINYINT(1) DEFAULT 0,
  isFeatured TINYINT(1) DEFAULT 0,
  is_approved TINYINT(1) DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  tags VARCHAR(500) DEFAULT NULL,
  specifications JSON NULL,
  colors JSON NULL,
  sizes JSON NULL,
  additionalImages JSON NULL,
  colorImages JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL
);

-- ========================================
-- PRODUCT IMAGES
-- ========================================
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================================
-- PRODUCT VARIANTS
-- ========================================
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_name VARCHAR(50),
  variant_value VARCHAR(100),
  sku VARCHAR(50) DEFAULT NULL,
  price DECIMAL(10, 2) DEFAULT NULL,
  stock INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================================
-- CARTS
-- ========================================
CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- ========================================
-- ORDERS
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Pending',
  payment_method VARCHAR(50) DEFAULT NULL,
  payment_reference VARCHAR(100) NULL,
  payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  shipping_address TEXT DEFAULT NULL,
  shipping_city VARCHAR(100) DEFAULT NULL,
  shipping_state VARCHAR(100) DEFAULT NULL,
  shipping_zip VARCHAR(20) DEFAULT NULL,
  shipping_country VARCHAR(100) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- ORDER ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  seller_id INT DEFAULT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL
);

-- ========================================
-- PAYMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  transaction_ref VARCHAR(100) DEFAULT NULL,
  chapa_tx_ref VARCHAR(100) DEFAULT NULL,
  payment_data JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ========================================
-- SHIPPING
-- ========================================
CREATE TABLE IF NOT EXISTS shipping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Ethiopia',
  status ENUM('Pending', 'Shipped', 'In Transit', 'Delivered') DEFAULT 'Pending',
  tracking_number VARCHAR(100),
  shipping_method VARCHAR(50) DEFAULT 'Standard',
  estimated_delivery DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ========================================
-- SHIPPING ZONES & RATES
-- ========================================
CREATE TABLE IF NOT EXISTS shipping_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  regions TEXT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipping_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_id INT NOT NULL,
  method_name VARCHAR(100) NOT NULL,
  min_weight DECIMAL(8,2) DEFAULT 0,
  max_weight DECIMAL(8,2) DEFAULT 999,
  base_rate DECIMAL(10,2) NOT NULL,
  per_kg_rate DECIMAL(10,2) DEFAULT 0,
  estimated_days INT DEFAULT 5,
  is_active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (zone_id) REFERENCES shipping_zones(id) ON DELETE CASCADE
);

-- ========================================
-- RETURNS
-- ========================================
CREATE TABLE IF NOT EXISTS returns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  order_item_id INT DEFAULT NULL,
  user_id INT NOT NULL,
  reason TEXT,
  status ENUM('Requested', 'Approved', 'Rejected', 'Completed') DEFAULT 'Requested',
  admin_notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- REVIEWS
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200) DEFAULT NULL,
  comment TEXT,
  is_verified TINYINT(1) DEFAULT 0,
  is_reported TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_product_review (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- NOTIFICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) DEFAULT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  link VARCHAR(500) DEFAULT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- WISHLISTS
-- ========================================
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================================
-- ADDRESSES
-- ========================================
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50) DEFAULT 'Home',
  full_name VARCHAR(100) DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  zip VARCHAR(20) DEFAULT '',
  country VARCHAR(100) DEFAULT 'Ethiopia',
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- SELLER WALLETS
-- ========================================
CREATE TABLE IF NOT EXISTS seller_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0,
  pending_balance DECIMAL(12, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wallet_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('credit', 'debit', 'withdrawal') NOT NULL,
  status ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Completed',
  description VARCHAR(255),
  reference VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES seller_wallets(id) ON DELETE CASCADE
);

-- ========================================
-- DISCOUNTS / COUPONS
-- ========================================
CREATE TABLE IF NOT EXISTS discounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discount_code VARCHAR(50) UNIQUE,
  title VARCHAR(200) DEFAULT NULL,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  product_id INT NULL,
  category_id INT NULL,
  seller_id INT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  usage_limit INT NULL,
  used_count INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS discount_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discount_id INT NOT NULL,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- FLASH SALES
-- ========================================
CREATE TABLE IF NOT EXISTS flash_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flash_sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flash_sale_id INT NOT NULL,
  product_id INT NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  stock_limit INT DEFAULT NULL,
  sold_count INT DEFAULT 0,
  FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================================
-- CMS / BANNERS
-- ========================================
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300) DEFAULT NULL,
  image VARCHAR(500) NOT NULL,
  link VARCHAR(500) DEFAULT NULL,
  position ENUM('hero', 'promo', 'sidebar') DEFAULT 'hero',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content LONGTEXT,
  is_published TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- NEWSLETTER
-- ========================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- SUPPORT TICKETS
-- ========================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- SEED DATA
-- ========================================

-- Categories (with subcategories using parent_id)
INSERT IGNORE INTO categories (id, name, slug, parent_id, sort_order) VALUES
(1, 'Electronics', 'electronics', NULL, 1),
(2, 'Fashion', 'fashion', NULL, 2),
(3, 'Books', 'books', NULL, 3),
(4, 'Home & Living', 'home-living', NULL, 4),
(5, 'Sports', 'sports', NULL, 5),
(6, 'Beauty', 'beauty', NULL, 6),
-- Subcategories
(7, 'Smartphones', 'smartphones', 1, 1),
(8, 'Laptops', 'laptops', 1, 2),
(9, 'Headphones', 'headphones', 1, 3),
(10, 'Cameras', 'cameras', 1, 4),
(11, 'Men\'s Clothing', 'mens-clothing', 2, 1),
(12, 'Women\'s Clothing', 'womens-clothing', 2, 2),
(13, 'Shoes', 'shoes', 2, 3),
(14, 'Accessories', 'accessories', 2, 4),
(15, 'Fiction', 'fiction', 3, 1),
(16, 'Non-Fiction', 'non-fiction', 3, 2),
(17, 'Programming', 'programming', 3, 3);

-- Brands
INSERT IGNORE INTO brands (id, name, slug) VALUES
(1, 'Apple', 'apple'),
(2, 'Samsung', 'samsung'),
(3, 'Nike', 'nike'),
(4, 'Sony', 'sony'),
(5, 'Adidas', 'adidas');

-- Seed products
INSERT IGNORE INTO products (id, name, slug, description, short_description, price, discount_price, stock, sku, category_id, brand_id, image, isNew, isSale, isFeatured, is_approved, rating, review_count, tags) VALUES
(1, 'Wireless Noise-Cancelling Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life, adaptive sound control, and crystal-clear audio.', 'Premium wireless headphones with ANC', 99.99, 79.99, 50, 'WH-001', 9, 4, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1, 1, 1, 1, 4.5, 128, 'headphones,wireless,noise-cancelling'),
(2, 'Smart Watch Pro', 'smart-watch-pro', 'Advanced fitness tracking smartwatch with GPS, heart rate monitor, and 7-day battery life.', 'Fitness smartwatch with GPS', 199.99, NULL, 30, 'SW-002', 1, 2, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 1, 0, 1, 1, 4.2, 85, 'smartwatch,fitness,gps'),
(3, 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'Ultra-comfortable 100% organic cotton t-shirt. Available in multiple colors and sizes.', 'Comfortable organic cotton t-shirt', 24.99, 19.99, 100, 'TS-003', 11, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 0, 1, 0, 1, 4.0, 256, 'tshirt,cotton,organic'),
(4, 'JavaScript: The Complete Guide', 'javascript-complete-guide', 'Master JavaScript from basics to advanced topics. The definitive guide for web developers.', 'Complete JavaScript programming guide', 39.99, NULL, 25, 'BK-004', 17, NULL, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 1, 0, 0, 1, 4.8, 342, 'javascript,programming,book'),
(5, 'Running Shoes Ultra', 'running-shoes-ultra', 'Lightweight and breathable running shoes with advanced cushioning technology for maximum comfort.', 'Lightweight cushioned running shoes', 129.99, 99.99, 45, 'SH-005', 13, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 1, 1, 1, 1, 4.6, 189, 'shoes,running,sports'),
(6, 'Laptop Pro 15"', 'laptop-pro-15', 'High-performance laptop with M-series chip, 16GB RAM, 512GB SSD, and stunning Retina display.', 'High-performance 15-inch laptop', 1299.99, 1199.99, 15, 'LP-006', 8, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 1, 1, 1, 1, 4.9, 67, 'laptop,computer,macbook'),
(7, 'Smart Home Speaker', 'smart-home-speaker', 'Voice-controlled smart speaker with premium 360-degree audio and smart home integration.', 'Voice-controlled smart speaker', 89.99, NULL, 60, 'SP-007', 1, NULL, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400', 0, 0, 0, 1, 4.1, 145, 'speaker,smart-home,voice'),
(8, 'Organic Face Cream', 'organic-face-cream', 'All-natural organic face cream with hyaluronic acid and vitamin E for radiant, youthful skin.', 'Natural organic face cream', 34.99, 29.99, 80, 'BC-008', 6, NULL, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', 0, 1, 0, 1, 4.3, 203, 'skincare,organic,beauty');

-- Default banners
INSERT IGNORE INTO banners (id, title, subtitle, image, link, position, sort_order, is_active) VALUES
(1, 'Summer Sale', 'Up to 50% off on selected items', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', '/products?sale=true', 'hero', 1, 1),
(2, 'New Arrivals', 'Check out the latest products', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', '/products?new=true', 'hero', 2, 1),
(3, 'Free Shipping', 'On orders over $50', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', '/products', 'promo', 1, 1);

-- Default CMS pages
INSERT IGNORE INTO pages (id, title, slug, content) VALUES
(1, 'About Us', 'about-us', '<h2>About Our Marketplace</h2><p>We are a multi-vendor marketplace connecting buyers with the best sellers worldwide.</p>'),
(2, 'Contact Us', 'contact-us', '<h2>Contact Us</h2><p>Email: support@marketplace.com</p><p>Phone: +251-XXX-XXXX</p>'),
(3, 'Privacy Policy', 'privacy-policy', '<h2>Privacy Policy</h2><p>Your privacy is important to us. This policy outlines how we handle your personal data.</p>'),
(4, 'Terms & Conditions', 'terms-conditions', '<h2>Terms & Conditions</h2><p>By using our platform, you agree to these terms and conditions.</p>');

-- Shipping zones
INSERT IGNORE INTO shipping_zones (id, name, regions) VALUES
(1, 'Addis Ababa', 'Addis Ababa'),
(2, 'Major Cities', 'Dire Dawa,Bahir Dar,Hawassa,Mekelle,Adama'),
(3, 'Other Regions', 'All other regions');

INSERT IGNORE INTO shipping_rates (id, zone_id, method_name, base_rate, per_kg_rate, estimated_days) VALUES
(1, 1, 'Standard Delivery', 50.00, 10.00, 2),
(2, 1, 'Express Delivery', 100.00, 15.00, 1),
(3, 2, 'Standard Delivery', 100.00, 15.00, 4),
(4, 2, 'Express Delivery', 200.00, 25.00, 2),
(5, 3, 'Standard Delivery', 150.00, 20.00, 7),
(6, 3, 'Express Delivery', 300.00, 30.00, 4);
