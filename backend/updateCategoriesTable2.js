const db = require("./config/db");

const queries = [
  'ALTER TABLE categories ADD COLUMN is_active TINYINT(1) DEFAULT 1 AFTER parent_id',
  'ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0 AFTER is_active',
  'ALTER TABLE categories ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER sort_order'
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
      console.log('\nAll categories table updates completed!');
      process.exit(0);
    }
  });
});
