const db = require("../config/db");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

const safeJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const sellerId = req.query.sellerId;
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const rating = req.query.rating;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT p.*, c.name AS category, s.store_name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
    `;

    const values = [];
    const conditions = [];

    if (sellerId) {
      conditions.push("p.seller_id = ?");
      values.push(sellerId);
    }

    if (category) {
      conditions.push("c.name = ?");
      values.push(category);
    }

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ? OR s.store_name LIKE ?)");
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push("p.price >= ?");
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push("p.price <= ?");
      values.push(maxPrice);
    }

    if (rating) {
      conditions.push("p.rating >= ?");
      values.push(rating);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // Add sorting
    const validSortFields = ['name', 'price', 'rating', 'created_at', 'stock'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY p.${sortField} ${sortDirection}`;

    // Add pagination
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const products = await query(sql, values);

    // Get total count for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
    `;

    if (conditions.length > 0) {
      countSql += " WHERE " + conditions.join(" AND ");
    }

    const countResult = await query(countSql, values.slice(0, -2)); // Remove limit and offset
    const totalProducts = countResult[0].total;

    const formattedProducts = products.map((p) => ({
      ...p,
      specifications: safeJson(p.specifications, {}),
      colors: safeJson(p.colors, []),
      sizes: safeJson(p.sizes, []),
      additionalImages: safeJson(p.additionalImages, []),
      colorImages: safeJson(p.colorImages, {}),
      reviews: safeJson(p.reviews, []),
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    console.log(`🔍 Looking for product with ID: ${req.params.id}`);
    
    const products = await query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    console.log(`📊 Query result:`, products.length, 'products found');
    console.log(`📋 Products data:`, products);

    if (products.length === 0) {
      console.log(`❌ Product not found for ID: ${req.params.id}`);
      return res.status(404).json({ 
        error: "Product not found",
        message: `No product exists with ID: ${req.params.id}`,
        searchedId: req.params.id
      });
    }

    const product = products[0];
    console.log(`✅ Found product:`, product.id, product.name);
    
    product.specifications = safeJson(product.specifications, {});
    product.colors = safeJson(product.colors, []);
    product.sizes = safeJson(product.sizes, []);
    product.additionalImages = safeJson(product.additionalImages, []);
    product.colorImages = safeJson(product.colorImages, {});
    product.reviews = safeJson(product.reviews, []);

    res.json(product);
  } catch (err) {
    console.error(`💥 Database error fetching product ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
};

// POST product (Seller/Admin)
exports.createProduct = async (req, res) => {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (role !== "seller" && role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Not authorized to create products" });
    }

    const {
      name,
      description,
      price,
      stock,
      image,
      category_id,
      isNew,
      isSale,
      rating,
      specifications,
      colors,
      sizes,
      additionalImages,
      colorImages,
      reviews,
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const seller_id = role === "admin" ? req.body.seller_id : req.user.sellerId || req.user.id;

    await query(
      `INSERT INTO products
      (name, description, price, stock, seller_id, image, category_id, isNew, isSale, rating, specifications, colors, sizes, additionalImages, colorImages, reviews)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || "",
        price || 0,
        stock || 0,
        seller_id,
        image || null,
        category_id || null,
        isNew ? 1 : 0,
        isSale ? 1 : 0,
        rating || 0,
        JSON.stringify(specifications || {}),
        JSON.stringify(colors || []),
        JSON.stringify(sizes || []),
        JSON.stringify(additionalImages || []),
        JSON.stringify(colorImages || {}),
        JSON.stringify(reviews || []),
      ]
    );

    res.status(201).json({ message: "Product added ?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT product (Seller/Admin)
exports.updateProduct = async (req, res) => {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (role !== "seller" && role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Not authorized to update products" });
    }

    // Check ownership if seller
    if (role === "seller") {
      const prod = await query("SELECT seller_id FROM products WHERE id = ?", [req.params.id]);
      if (prod.length === 0) return res.status(404).json({ error: "Product not found" });

      const sellerId = req.user.sellerId || req.user.id;
      if (Number(prod[0].seller_id) !== Number(sellerId)) {
        return res.status(403).json({ error: "Not authorized to update this product" });
      }
    }

    const {
      name,
      description,
      price,
      stock,
      image,
      category_id,
      isNew,
      isSale,
      rating,
      specifications,
      colors,
      sizes,
      additionalImages,
      colorImages,
      reviews,
    } = req.body;

    const result = await query(
      `UPDATE products
       SET name=?, description=?, price=?, stock=?, image=?, category_id=?, isNew=?, isSale=?, rating=?, specifications=?, colors=?, sizes=?, additionalImages=?, colorImages=?, reviews=?
       WHERE id=?`,
      [
        name,
        description,
        price,
        stock,
        image,
        category_id || null,
        isNew ? 1 : 0,
        isSale ? 1 : 0,
        rating,
        JSON.stringify(specifications || {}),
        JSON.stringify(colors || []),
        JSON.stringify(sizes || []),
        JSON.stringify(additionalImages || []),
        JSON.stringify(colorImages || {}),
        JSON.stringify(reviews || []),
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated ?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE product (Seller/Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (role !== "seller" && role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Not authorized to delete products" });
    }

    // Check ownership if seller
    if (role === "seller") {
      const prod = await query("SELECT seller_id FROM products WHERE id=?", [req.params.id]);
      if (prod.length === 0) return res.status(404).json({ error: "Product not found" });

      const sellerId = req.user.sellerId || req.user.id;
      if (Number(prod[0].seller_id) !== Number(sellerId)) {
        return res.status(403).json({ error: "Not authorized to delete this product" });
      }
    }

    const result = await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted ?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
