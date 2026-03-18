// backend/createContentTables.js
const mysql = require("mysql2");
require("dotenv").config();

// Create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "161920",
  database: process.env.DB_NAME || "ecommerce",
});

// Create banners table
const createBannersTable = `
  CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image VARCHAR(500) NULL,
    link VARCHAR(500) NULL,
    position ENUM('hero', 'sidebar', 'footer') DEFAULT 'hero',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Create pages table
const createPagesTable = `
  CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NULL UNIQUE,
    content TEXT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Insert sample banners
const insertSampleBanners = `
  INSERT INTO banners (title, subtitle, image, link, position, sort_order) VALUES
  ('Summer Sale', 'Get up to 50% off on selected items', 'https://images.unsplash.com/photo-1441986300917-64274b80c34f', '/products', 'hero', 1),
  ('New Arrivals', 'Check out our latest products', 'https://images.unsplash.com/photo-1441986300917-64274b80c34f', '/categories', 'sidebar', 2),
  ('Free Shipping', 'On orders over $50', 'https://images.unsplash.com/photo-1441986300917-64274b80c34f', '/shipping', 'footer', 3)
`;

// Insert sample pages
const insertSamplePages = `
  INSERT INTO pages (title, slug, content, is_published) VALUES
  ('About Us', 'about', '<h1>About Our Company</h1><p>We are a leading e-commerce platform...</p>', TRUE),
  ('Terms of Service', 'terms', '<h1>Terms of Service</h1><p>By using our platform...</p>', TRUE),
  ('Privacy Policy', 'privacy', '<h1>Privacy Policy</h1><p>We take your privacy seriously...</p>', TRUE),
  ('Contact Us', 'contact', '<h1>Contact Us</h1><p>Get in touch with our team...</p>', FALSE)
`;

async function createTables() {
  try {
    console.log("Creating banners table...");
    await connection.promise().query(createBannersTable);
    console.log("✅ Banners table created successfully");

    console.log("Creating pages table...");
    await connection.promise().query(createPagesTable);
    console.log("✅ Pages table created successfully");

    console.log("Inserting sample banners...");
    await connection.promise().query(insertSampleBanners);
    console.log("✅ Sample banners inserted successfully");

    console.log("Inserting sample pages...");
    await connection.promise().query(insertSamplePages);
    console.log("✅ Sample pages inserted successfully");

  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    await connection.promise().end();
    console.log("🔌 Connection closed");
  }
}

createTables();
