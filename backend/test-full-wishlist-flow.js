const http = require('http');

async function testFullWishlistFlow() {
  console.log('🧪 Testing Complete Wishlist Flow...');
  
  try {
    // Step 1: Login as customer
    console.log('\n📝 Step 1: Logging in as customer...');
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
      console.log('✅ Login successful!');
      console.log('User:', loginResponse.data.user.name);
      console.log('Role:', loginResponse.data.user.role);
      
      // Step 2: Get current wishlist
      console.log('\n📋 Step 2: Getting current wishlist...');
      const getResponse = await new Promise((resolve, reject) => {
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
      
      console.log('Wishlist GET:', getResponse);
      console.log('Current items:', getResponse.data.length || 0);
      
      // Step 3: Add product to wishlist
      console.log('\n➕ Step 3: Adding product 1 to wishlist...');
      const addResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/wishlist/1',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': 0
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
      
      console.log('Wishlist POST:', addResponse);
      
      // Step 4: Verify it was added
      console.log('\n🔍 Step 4: Verifying item was added...');
      const verifyResponse = await new Promise((resolve, reject) => {
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
      
      console.log('Wishlist after adding:', verifyResponse);
      console.log('Total items now:', verifyResponse.data.length || 0);
      
      // Step 5: Remove from wishlist
      console.log('\n🗑️ Step 5: Removing product 1 from wishlist...');
      const removeResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/wishlist/1',
          method: 'DELETE',
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
      
      console.log('Wishlist DELETE:', removeResponse);
      
      console.log('\n🎉 Full wishlist flow test completed!');
      
    } else {
      console.log('❌ Login failed:', loginResponse);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testFullWishlistFlow();
