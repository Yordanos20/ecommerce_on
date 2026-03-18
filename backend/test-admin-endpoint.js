const http = require('http');

async function testAdminEndpoint() {
  try {
    console.log('Testing admin dashboard endpoint...');
    
    // First login as admin to get token
    const loginData = JSON.stringify({
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
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
    
    console.log('Login response:', loginResponse);
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      // Now test dashboard endpoint
      const dashboardOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/dashboard',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      };
      
      const dashboardResponse = await new Promise((resolve, reject) => {
        const req = http.request(dashboardOptions, (res) => {
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
      
      console.log('Dashboard response:', dashboardResponse);
    } else {
      console.log('Login failed, cannot test dashboard');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    process.exit(0);
  }
}

testAdminEndpoint();
