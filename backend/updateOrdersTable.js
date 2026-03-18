const db = require("./config/db");

const queries = [
  'ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(100) DEFAULT NULL AFTER status',
  'ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT NULL AFTER payment_reference',
  'ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
];

let completed = 0;
queries.forEach((sql, index) => {
  db.query(sql, (err, result) => {
    completed++;
    if (err) {
      console.log(`Query ${index + 1} failed (might already exist): ${err.message}`);
    } else {
      console.log(`Query ${index + 1} executed successfully`);
    }
    
    if (completed === queries.length) {
      console.log('\nAll orders table updates completed!');
      process.exit(0);
    }
  });
});
