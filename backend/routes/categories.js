// backend/routes/categories.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");
const roleCheck = require("../config/middleware/role");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => (err ? reject(err) : resolve(result)));
  });

// GET all categories (tree structure)
router.get("/", async (req, res) => {
  try {
    const categories = await query(
      "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC"
    );

    // Build tree structure
    const parentCategories = categories.filter(c => !c.parent_id);
    const result = parentCategories.map(parent => ({
      ...parent,
      subcategories: categories.filter(c => c.parent_id === parent.id)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET flat list of all categories
router.get("/flat", async (req, res) => {
  try {
    const categories = await query(
      "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC"
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const cats = await query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
    if (cats.length === 0) return res.status(404).json({ error: "Category not found" });

    const subcats = await query("SELECT * FROM categories WHERE parent_id = ?", [req.params.id]);
    res.json({ ...cats[0], subcategories: subcats });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Create category (Admin)
router.post("/", auth, roleCheck(["Admin"]), async (req, res) => {
  try {
    const { name, slug, image, parent_id, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await query(
      "INSERT INTO categories (name, slug, image, parent_id, sort_order) VALUES (?, ?, ?, ?, ?)",
      [name, categorySlug, image || null, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ message: "Category created" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Category slug already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// PUT - Update category (Admin)
router.put("/:id", auth, roleCheck(["Admin"]), async (req, res) => {
  try {
    const { name, slug, image, parent_id, sort_order, is_active } = req.body;
    await query(
      "UPDATE categories SET name=?, slug=?, image=?, parent_id=?, sort_order=?, is_active=? WHERE id=?",
      [name, slug, image, parent_id || null, sort_order || 0, is_active !== undefined ? is_active : 1, req.params.id]
    );
    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Delete category (Admin)
router.delete("/:id", auth, roleCheck(["Admin"]), async (req, res) => {
  try {
    await query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;