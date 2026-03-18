const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../config/middleware/auth");
const roleCheck = require("../config/middleware/role");

// Customer view their shipping
router.get("/", auth, (req,res)=>{
  const user_id = req.user.id;
  db.query("SELECT s.*,o.customer_id FROM shipping s JOIN orders o ON s.order_id=o.id WHERE o.customer_id=?",[user_id],(err,results)=>{
    if(err) return res.status(500).json({error:"Server error"});
    res.json(results);
  });
});

// Admin update shipping status
router.post("/update/:id", auth, roleCheck(["admin"]), (req,res)=>{
  const id = req.params.id;
  const {status} = req.body;
  db.query("UPDATE shipping SET status=? WHERE id=?",[status,id],(err,result)=>{
    if(err) return res.status(500).json({error:"Server error"});
    res.json({message:"Shipping updated ✅"});
  });
});

module.exports = router;