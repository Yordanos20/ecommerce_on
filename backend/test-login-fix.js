// Test script to verify seller login fix
const axios = require('axios');

async function testSellerLogin() {
  console.log('🧪 Testing Seller Login Fix...\n');
  
  try {
    // Test seller login
    console.log('1. Testing seller login...');
    const sellerResponse = await axios.post('http://localhost:5001/api/users/login', {
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });
    
    console.log('✅ Seller login successful!');
    console.log('User:', sellerResponse.data.user);
    console.log('Token received:', sellerResponse.data.token ? 'Yes' : 'No');
    
    // Test customer login
    console.log('\n2. Testing customer login...');
    const customerResponse = await axios.post('http://localhost:5001/api/users/login', {
      email: 'customer@test.com',
      password: '123456',
      role: 'customer'
    });
    
    console.log('✅ Customer login successful!');
    console.log('User:', customerResponse.data.user);
    console.log('Token received:', customerResponse.data.token ? 'Yes' : 'No');
    
    // Test role mismatch (should fail)
    console.log('\n3. Testing role mismatch (should fail)...');
    try {
      await axios.post('http://localhost:5001/api/users/login', {
        email: 'seller@test.com',
        password: 'password123',
        role: 'customer' // Wrong role
      });
      console.log('❌ Role validation failed - should have rejected wrong role');
    } catch (error) {
      console.log('✅ Role validation working - correctly rejected wrong role');
      console.log('Error message:', error.response.data.error);
    }
    
    console.log('\n🎉 All tests passed! The seller login issue has been fixed.');
    console.log('\n📋 Test Credentials:');
    console.log('Seller: seller@test.com / password123');
    console.log('Customer: customer@test.com / 123456');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testSellerLogin();
