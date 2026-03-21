// Test dashboard connectivity
const axios = require('axios');

async function testDashboardConnectivity() {
  console.log('🧪 Testing Dashboard Connectivity...\n');
  
  try {
    // Login first
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
    
    console.log('✅ Login successful');
    
    // Test each endpoint sequentially
    const endpoints = [
      { name: 'Dashboard', url: 'http://localhost:5001/api/seller/dashboard' },
      { name: 'Orders', url: 'http://localhost:5001/api/seller/orders?limit=5' },
      { name: 'Revenue', url: 'http://localhost:5001/api/seller/revenue' },
      { name: 'Top Products', url: 'http://localhost:5001/api/seller/top-products?limit=3' },
      { name: 'Low Stock', url: 'http://localhost:5001/api/seller/low-stock?threshold=10' },
      { name: 'Reviews', url: 'http://localhost:5001/api/reviews/seller/reviews?limit=3' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testing ${endpoint.name}...`);
        const response = await axios.get(endpoint.url, { headers });
        console.log(`✅ ${endpoint.name}: SUCCESS (${response.status})`);
        
        if (endpoint.name === 'Dashboard') {
          console.log(`   Data: ${JSON.stringify(response.data)}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ ${endpoint.name}: FAILED`);
        console.log(`   Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    console.log('\n🎉 Dashboard connectivity test completed!');
    
  } catch (error) {
    console.error('❌ Test setup failed:', error.response?.data || error.message);
  }
}

testDashboardConnectivity();
