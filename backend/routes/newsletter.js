// backend/routes/newsletter.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"My Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      text: "Welcome! You have successfully subscribed to our newsletter.",
      html: "<h1>Welcome!</h1><p>You have successfully subscribed to our newsletter.</p>",
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to subscribe. Try again later." });
  }
});

module.exports = router;