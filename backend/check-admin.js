const db = require('./config/db');

db.promise().query('SELECT id, name, email, role FROM users WHERE LOWER(role) = "admin"')
.then(([admins]) => {
  console.log('Admin users:', admins);
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
