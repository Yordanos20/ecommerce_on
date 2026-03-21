// Test proxy connection through frontend
const axios = require('axios');

async function testProxyConnection() {
  console.log('🧪 Testing proxy connection through frontend...');
  
  try {
    // Test if frontend can reach backend through proxy
    const response = await axios.get('http://localhost:3000/api/test', {
      timeout: 5000
    });
    
    console.log('✅ Proxy connection successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Frontend server not accessible');
    } else {
      console.log('❌ Proxy test failed:', error.message);
    }
  }
}

testProxyConnection();
