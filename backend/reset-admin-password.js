const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.promise().query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'madmin@gmail.com']
    );
    
    console.log('✅ Admin password reset successfully');
    console.log('Login credentials: madmin@gmail.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
}

resetAdminPassword();
