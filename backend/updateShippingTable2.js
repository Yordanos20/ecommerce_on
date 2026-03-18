const db = require("./config/db");

const queries = [
  'ALTER TABLE shipping ADD COLUMN phone VARCHAR(20) DEFAULT NULL AFTER country',
  'ALTER TABLE shipping ADD COLUMN email VARCHAR(255) DEFAULT NULL AFTER phone'
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
      console.log('\nAll shipping table updates completed!');
      process.exit(0);
    }
  });
});
