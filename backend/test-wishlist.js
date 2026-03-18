const http = require('http');

async function testWishlist() {
  try {
    console.log('Testing wishlist endpoints...');
    
    // Test login first
    const loginData = JSON.stringify({
      email: 'john.smith@email.com',
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
      console.log('✅ Login successful, testing wishlist...');
      
      // Test wishlist GET
      const wishlistResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/wishlist',
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
      
      console.log('📋 Wishlist GET Response:', wishlistResponse);
      
      // Test wishlist POST (add product)
      const addData = JSON.stringify({});
      const addResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/wishlist/1',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(addData)
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
        req.write(addData);
        req.end();
      });
      
      console.log('➕ Wishlist POST Response:', addResponse);
      
    } else {
      console.log('❌ Login failed:', loginResponse);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testWishlist();
