const http = require('http');

async function testAdminEndpoints() {
  try {
    console.log('Testing admin endpoints...');
    
    // First login as admin to get token
    const loginData = JSON.stringify({
      email: 'madmin@gmail.com',
      password: 'admin123'
    });
    
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/login',
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
      const dashboardResponse = await testEndpoint('/api/admin/dashboard', token);
      console.log('Dashboard:', dashboardResponse.status, dashboardResponse.data);
      
      // Test notifications endpoint
      console.log('\n--- Testing Notifications ---');
      const notificationsResponse = await testEndpoint('/api/admin/notifications', token);
      console.log('Notifications:', notificationsResponse.status, notificationsResponse.data);
      
      // Test system info endpoint
      console.log('\n--- Testing System Info ---');
      const systemInfoResponse = await testEndpoint('/api/admin/system/info', token);
      console.log('System Info:', systemInfoResponse.status, systemInfoResponse.data);
      
    } else {
      console.log('Login failed, cannot test endpoints');
    }
    
  } catch (error) {
    console.error('Test error:', error);
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

testAdminEndpoints();
