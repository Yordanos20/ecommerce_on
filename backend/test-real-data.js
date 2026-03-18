const http = require('http');

async function testRealData() {
  try {
    console.log('🔍 Testing real data sources...');
    
    // Login as seller
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
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log('✅ Seller login successful');
      
      // Test all endpoints
      const endpoints = [
        { name: 'Dashboard', path: '/api/seller/dashboard' },
        { name: 'Orders', path: '/api/seller/orders' },
        { name: 'Revenue', path: '/api/seller/revenue' },
        { name: 'Top Products', path: '/api/seller/top-products?limit=5' },
        { name: 'Low Stock', path: '/api/seller/low-stock?threshold=10' },
        { name: 'Reviews', path: '/api/reviews/seller/reviews?limit=5' }
      ];
      
      for (const endpoint of endpoints) {
        const response = await testEndpoint(endpoint.path, token);
        console.log(`📊 ${endpoint.name}: ${response.status} - ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      
    } else {
      console.log('❌ Login failed');
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

testRealData();
