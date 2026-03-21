const axios = require('axios');

async function testIndividualEndpoints() {
  console.log('🧪 Testing each seller dashboard endpoint individually...\n');
  
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5001/api/users/login', {
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');
    
    const endpoints = [
      '/seller/dashboard',
      '/seller/orders?limit=10',
      '/seller/revenue',
      '/seller/top-products?limit=5',
      '/seller/low-stock?threshold=10',
      '/reviews/seller/reviews?limit=5'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3000/api${endpoint}`, {
          headers: { Authorization: 'Bearer ' + token },
          timeout: 3000
        });
        console.log(`✅ ${endpoint}: ${response.status} - OK`);
        
        // Show data length for specific endpoints
        if (endpoint.includes('orders')) {
          console.log(`   Orders count: ${response.data.length}`);
        } else if (endpoint.includes('revenue')) {
          console.log(`   Revenue months: ${response.data.length}`);
        } else if (endpoint.includes('reviews')) {
          console.log(`   Reviews count: ${response.data.reviews?.length || 0}`);
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status || error.code}`);
        console.log(`   Message: ${error.response?.data?.message || error.message}`);
        console.log(`   Details: ${JSON.stringify(error.response?.data || 'No details')}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }
}

testIndividualEndpoints();
