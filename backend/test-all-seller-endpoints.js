// Comprehensive test for all seller endpoints
const axios = require('axios');

async function testSellerEndpoints() {
  console.log('🧪 Testing All Seller Endpoints...\n');
  
  // Get a fresh token first
  try {
    const loginResponse = await axios.post('http://localhost:5001/api/users/login', {
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });
    
    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login successful, token obtained');
    
    // Test all endpoints that were causing errors
    const endpoints = [
      { url: '/api/seller/dashboard', name: 'Dashboard' },
      { url: '/api/seller/inventory', name: 'Inventory' },
      { url: '/api/seller/orders?limit=5', name: 'Orders' },
      { url: '/api/seller/revenue', name: 'Revenue' },
      { url: '/api/seller/top-products?limit=5', name: 'Top Products' },
      { url: '/api/seller/low-stock?threshold=10', name: 'Low Stock' },
      { url: '/api/reviews/seller/reviews', name: 'Reviews' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n📡 Testing ${endpoint.name}...`);
        const response = await axios.get(`http://localhost:5001${endpoint.url}`, { headers });
        console.log(`✅ ${endpoint.name}: SUCCESS (${response.status})`);
        
        if (endpoint.name === 'Dashboard') {
          console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
        } else if (endpoint.name === 'Inventory') {
          console.log(`   Products: ${response.data.length} items`);
        } else if (endpoint.name === 'Reviews') {
          console.log(`   Reviews: ${response.data.reviews?.length || 0} items`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: FAILED`);
        console.log(`   Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    console.log('\n🎉 Seller endpoints testing completed!');
    
  } catch (error) {
    console.error('❌ Test setup failed:', error.response?.data || error.message);
  }
}

testSellerEndpoints();
