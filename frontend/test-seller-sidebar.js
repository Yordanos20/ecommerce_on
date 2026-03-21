// Test script to verify seller sidebar functionality
console.log('Testing seller sidebar functionality...');

// Test 1: Check if SellerLayout component exists
try {
  const SellerLayout = require('./src/components/SellerLayout.js');
  console.log('✅ SellerLayout component found');
} catch (error) {
  console.log('❌ SellerLayout component not found:', error.message);
}

// Test 2: Check if sidebar toggle functionality is implemented
try {
  const fs = require('fs');
  const sellerLayoutContent = fs.readFileSync('./src/components/SellerLayout.js', 'utf8');
  
  if (sellerLayoutContent.includes('setSidebarOpen(!sidebarOpen)')) {
    console.log('✅ Sidebar toggle functionality found');
  } else {
    console.log('❌ Sidebar toggle functionality not found');
  }
  
  if (sellerLayoutContent.includes('FaTimes') && sellerLayoutContent.includes('FaBars')) {
    console.log('✅ Toggle icons (hamburger/close) found');
  } else {
    console.log('❌ Toggle icons not found');
  }
  
  if (sellerLayoutContent.includes('w-64') && sellerLayoutContent.includes('w-20')) {
    console.log('✅ Dynamic sidebar width classes found');
  } else {
    console.log('❌ Dynamic sidebar width classes not found');
  }
  
} catch (error) {
  console.log('❌ Error reading SellerLayout:', error.message);
}

console.log('Seller sidebar test completed!');
