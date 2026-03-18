const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");

const db = require("../config/db");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Get seller wallet balance
router.get("/seller/:sellerId", auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Check if user is authorized (seller or admin)
    if (req.user.role !== 'Admin' && !(req.user.sellerId && req.user.sellerId == sellerId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const wallets = await query(
      "SELECT * FROM seller_wallets WHERE seller_id = ?",
      [sellerId]
    );

    if (wallets.length === 0) {
      // Create wallet if it doesn't exist
      await query(
        "INSERT INTO seller_wallets (seller_id, balance) VALUES (?, 0)",
        [sellerId]
      );
      return res.json({ sellerId, balance: 0 });
    }

    res.json(wallets[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get wallet transaction history
router.get("/transactions/:sellerId", auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Check if user is authorized (seller or admin)
    if (req.user.role !== 'Admin' && !(req.user.sellerId && req.user.sellerId == sellerId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const transactions = await query(
      `SELECT wt.*, sw.seller_id 
       FROM wallet_transactions wt 
       JOIN seller_wallets sw ON wt.wallet_id = sw.id 
       WHERE sw.seller_id = ? 
       ORDER BY wt.created_at DESC`,
      [sellerId]
    );

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add funds to wallet (admin only)
router.post("/add-funds", auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { sellerId, amount, description } = req.body;

    if (!sellerId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid seller ID or amount" });
    }

    // Get or create wallet
    let wallets = await query("SELECT * FROM seller_wallets WHERE seller_id = ?", [sellerId]);
    
    if (wallets.length === 0) {
      await query("INSERT INTO seller_wallets (seller_id, balance) VALUES (?, 0)", [sellerId]);
      wallets = await query("SELECT * FROM seller_wallets WHERE seller_id = ?", [sellerId]);
    }

    const wallet = wallets[0];

    // Update balance
    await query(
      "UPDATE seller_wallets SET balance = balance + ? WHERE id = ?",
      [amount, wallet.id]
    );

    // Record transaction
    await query(
      "INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, 'credit', ?)",
      [wallet.id, amount, description || 'Admin credit']
    );

    res.json({ message: "Funds added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Withdraw funds (seller only)
router.post("/withdraw", auth, async (req, res) => {
  try {
    if (req.user.role !== 'Seller' || !req.user.sellerId) {
      return res.status(403).json({ error: "Seller access required" });
    }

    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const sellerId = req.user.sellerId;

    // Get wallet
    const wallets = await query("SELECT * FROM seller_wallets WHERE seller_id = ?", [sellerId]);
    
    if (wallets.length === 0) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const wallet = wallets[0];

    // Check balance
    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update balance
    await query(
      "UPDATE seller_wallets SET balance = balance - ? WHERE id = ?",
      [amount, wallet.id]
    );

    // Record transaction
    await query(
      "INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, 'debit', ?)",
      [wallet.id, amount, `Withdrawal - ${bankDetails || 'Bank transfer'}`]
    );

    res.json({ message: "Withdrawal request processed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get seller earnings summary
router.get("/earnings/:sellerId", auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Check if user is authorized (seller or admin)
    if (req.user.role !== 'Admin' && !(req.user.sellerId && req.user.sellerId == sellerId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Get total sales
    const salesResult = await query(
      `SELECT SUM(oi.quantity * oi.price) as total_sales,
              COUNT(DISTINCT o.id) as total_orders,
              SUM(oi.quantity) as total_items_sold
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.seller_id = ? AND o.status != 'Cancelled'`,
      [sellerId]
    );

    // Get current month earnings
    const monthResult = await query(
      `SELECT SUM(oi.quantity * oi.price) as month_sales
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.seller_id = ? 
       AND o.status != 'Cancelled'
       AND MONTH(o.created_at) = MONTH(CURRENT_DATE())
       AND YEAR(o.created_at) = YEAR(CURRENT_DATE())`,
      [sellerId]
    );

    // Get wallet balance
    const wallets = await query("SELECT balance FROM seller_wallets WHERE seller_id = ?", [sellerId]);
    const currentBalance = wallets.length > 0 ? wallets[0].balance : 0;

    res.json({
      total_sales: salesResult[0].total_sales || 0,
      total_orders: salesResult[0].total_orders || 0,
      total_items_sold: salesResult[0].total_items_sold || 0,
      month_sales: monthResult[0].month_sales || 0,
      current_balance: currentBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;