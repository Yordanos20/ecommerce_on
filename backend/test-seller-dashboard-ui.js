// Test to verify seller dashboard is working end-to-end
const axios = require('axios');

async function testSellerDashboardFlow() {
  console.log('🧪 Testing Seller Dashboard End-to-End Flow...\n');
  
  try {
    // Step 1: Login as seller
    console.log('📝 Step 1: Logging in as seller...');
    const loginResponse = await axios.post('http://localhost:5001/api/users/login', {
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Test all dashboard data endpoints through proxy
    console.log('\n📊 Step 2: Testing dashboard endpoints...');
    
    const endpoints = [
      { name: 'Dashboard Stats', url: '/api/seller/dashboard' },
      { name: 'Orders', url: '/api/seller/orders?limit=5' },
      { name: 'Inventory', url: '/api/seller/inventory' },
      { name: 'Revenue', url: '/api/seller/revenue' },
      { name: 'Reviews', url: '/api/reviews/seller/reviews' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3000${endpoint.url}`, {
          headers: { Authorization: 'Bearer ' + token },
          timeout: 5000
        });
        
        console.log(`✅ ${endpoint.name}: ${response.status} - Data received`);
        
        if (endpoint.name === 'Dashboard Stats') {
          const data = response.data;
          console.log(`   📈 Products: ${data.totalProducts}, Orders: ${data.totalOrders}, Revenue: $${data.totalRevenue}`);
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Failed - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Seller dashboard flow test completed!');
    console.log('📱 The seller dashboard should now be displaying real data.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSellerDashboardFlow();
