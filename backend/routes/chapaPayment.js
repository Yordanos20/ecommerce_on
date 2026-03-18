const express = require("express");
const router = express.Router();
const auth = require("../config/middleware/auth");
const axios = require("axios");

const db = require("../config/db");

// Helper for DB queries
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Chapa configuration
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST_xxxxxxxxxxxxxxxx';
const CHAPA_URL = 'https://api.chapa.co/v1/transaction/initialize';

// Initialize payment
router.post("/initialize", auth, async (req, res) => {
  try {
    const { orderId, amount, email, first_name, last_name, callback_url } = req.body;

    if (!orderId || !amount || !email) {
      return res.status(400).json({ error: "Order ID, amount, and email are required" });
    }

    console.log("Chapa payment request:", { orderId, amount, email, first_name, last_name });

    // Verify order belongs to user
    const orders = await query(
      "SELECT * FROM orders WHERE id = ? AND customer_id = ?",
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    // Generate transaction reference
    const tx_ref = `tx_${Date.now()}_${orderId}`;

    // For testing purposes, return a mock response if Chapa key is test key
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY.includes('TEST')) {
      console.log("Using Chapa test mode - simulating payment redirect");
      
      // Update order with transaction reference
      await query(
        "UPDATE orders SET payment_reference = ? WHERE id = ?",
        [tx_ref, orderId]
      );

      // Simulate Chapa checkout page redirect (in production, this would be real Chapa URL)
      const mockChapaUrl = `http://localhost:3000/payment/verify?payment=success&tx_ref=${tx_ref}`;
      
      return res.json({
        success: true,
        checkout_url: mockChapaUrl,
        tx_ref: tx_ref,
        test_mode: true
      });
    }

    // Prepare payment data
    const paymentData = {
      amount: amount,
      currency: 'ETB',
      email: email,
      first_name: first_name || req.user.name.split(' ')[0],
      last_name: last_name || req.user.name.split(' ')[1] || '',
      tx_ref: tx_ref,
      callback_url: callback_url || `http://localhost:3000/payment/verify`,
      return_url: `http://localhost:3000/orders/${orderId}`,
      customization: {
        title: 'E-Commerce Payment',
        description: `Payment for order #${orderId}`
      }
    };

    // Make request to Chapa
    const response = await axios.post(CHAPA_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'success') {
      // Store transaction reference in database
      await query(
        "UPDATE orders SET payment_reference = ? WHERE id = ?",
        [tx_ref, orderId]
      );

      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({ error: "Payment initialization failed" });
    }

  } catch (err) {
    console.error("Chapa payment error:", err);
    res.status(500).json({ error: "Payment processing error" });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) {
      return res.status(400).json({ error: "Transaction reference is required" });
    }

    console.log("Verifying payment for tx_ref:", tx_ref);

    // For testing purposes, skip actual Chapa API call if using test key
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY.includes('TEST')) {
      console.log("Using Chapa test mode - simulating successful payment verification");
      
      // Update order status
      await query(
        "UPDATE orders SET status = 'Processing' WHERE payment_reference = ?",
        [tx_ref]
      );

      // Update payment record
      await query(
        "UPDATE payments SET payment_status = 'Completed', payment_method = 'Chapa' WHERE order_id = (SELECT id FROM orders WHERE payment_reference = ?)",
        [tx_ref]
      );

      // Get order details for notification
      const orderResult = await query(
        "SELECT o.*, u.email FROM orders o JOIN users u ON o.customer_id = u.id WHERE o.payment_reference = ?",
        [tx_ref]
      );

      if (orderResult.length > 0) {
        const order = orderResult[0];
        
        // Create notification for customer
        await query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
          [order.customer_id, 'Payment Successful', `Payment successful for order #${order.id}`, 'order']
        );

        // Create notifications for sellers
        await query(
          `INSERT INTO notifications (user_id, title, message, type) 
           SELECT DISTINCT s.user_id, ?, ?, ? 
           FROM order_items oi 
           JOIN sellers s ON oi.seller_id = s.id 
           WHERE oi.order_id = ?`,
          ['New Order', `New order #${order.id} received`, 'order', order.id]
        );
      }

      return res.json({
        success: true,
        message: "Payment verified successfully (test mode)"
      });
    }

    // Real Chapa verification (for production)
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    if (response.data.status === 'success' && response.data.data.status === 'success') {
      // Update order status
      await query(
        "UPDATE orders SET status = 'Processing' WHERE payment_reference = ?",
        [tx_ref]
      );

      // Update payment record
      await query(
        "UPDATE payments SET payment_status = 'Completed', payment_method = 'Chapa' WHERE order_id = (SELECT id FROM orders WHERE payment_reference = ?)",
        [tx_ref]
      );

      // Get order details for notification
      const orderResult = await query(
        "SELECT o.*, u.email FROM orders o JOIN users u ON o.customer_id = u.id WHERE o.payment_reference = ?",
        [tx_ref]
      );

      if (orderResult.length > 0) {
        const order = orderResult[0];
        
        // Create notification for customer
        await query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
          [order.customer_id, 'Payment Successful', `Payment successful for order #${order.id}`, 'order']
        );

        // Create notifications for sellers
        await query(
          `INSERT INTO notifications (user_id, title, message, type) 
           SELECT DISTINCT s.user_id, ?, ?, ? 
           FROM order_items oi 
           JOIN sellers s ON oi.seller_id = s.id 
           WHERE oi.order_id = ?`,
          ['New Order', `New order #${order.id} received`, 'order', order.id]
        );
      }

      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({ error: "Payment verification failed" });
    }

  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Verification error" });
  }
});

// Payment callback (webhook)
router.post("/callback", async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    if (!tx_ref) {
      return res.status(400).json({ error: "Transaction reference is required" });
    }

    if (status === 'success') {
      // Update order status
      await query(
        "UPDATE orders SET status = 'Processing' WHERE payment_reference = ?",
        [tx_ref]
      );

      // Update payment record
      await query(
        "UPDATE payments SET payment_status = 'Completed' WHERE order_id = (SELECT id FROM orders WHERE payment_reference = ?)",
        [tx_ref]
      );
    }

    res.json({ status: "received" });

  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook processing error" });
  }
});

// Get payment status
router.get("/status/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const orders = await query(
      "SELECT o.*, p.payment_status FROM orders o LEFT JOIN payments p ON o.id = p.order_id WHERE o.id = ? AND o.customer_id = ?",
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    res.json({
      orderId: order.id,
      status: order.status,
      payment_status: order.payment_status,
      payment_reference: order.payment_reference,
      total_price: order.total_price
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
