const http = require('http');

async function testSellerEndpoints() {
  try {
    console.log('🧪 Testing seller endpoints...');
    
    // First login as seller to get token
    const loginData = JSON.stringify({
      email: 'seller@test.com',
      password: 'password123'
    });
    
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });
    
    console.log('Login response:', loginResponse.status, loginResponse.data);
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      const token = loginResponse.data.token;
      
      // Test dashboard endpoint
      console.log('\n--- Testing Dashboard ---');
      const dashboardResponse = await testEndpoint('/api/seller/dashboard', token);
      console.log('Dashboard:', dashboardResponse.status, dashboardResponse.data);
      
      // Test orders endpoint
      console.log('\n--- Testing Orders ---');
      const ordersResponse = await testEndpoint('/api/seller/orders?limit=5', token);
      console.log('Orders:', ordersResponse.status, ordersResponse.data);
      
      // Test revenue endpoint
      console.log('\n--- Testing Revenue ---');
      const revenueResponse = await testEndpoint('/api/seller/revenue', token);
      console.log('Revenue:', revenueResponse.status, revenueResponse.data);
      
      // Test top products endpoint
      console.log('\n--- Testing Top Products ---');
      const topProductsResponse = await testEndpoint('/api/seller/top-products?limit=5', token);
      console.log('Top Products:', topProductsResponse.status, topProductsResponse.data);
      
      // Test low stock endpoint
      console.log('\n--- Testing Low Stock ---');
      const lowStockResponse = await testEndpoint('/api/seller/low-stock?threshold=10', token);
      console.log('Low Stock:', lowStockResponse.status, lowStockResponse.data);
      
    } else {
      console.log('❌ Login failed, cannot test endpoints');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    process.exit(0);
  }
}

function testEndpoint(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

testSellerEndpoints();
