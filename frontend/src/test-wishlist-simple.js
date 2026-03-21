// Simple test to check wishlist API calls
import api from './services/api.js';

async function testWishlistAPI() {
  console.log('🧪 Testing Wishlist API...');
  
  try {
    // Test 1: Check if we can get the token
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Token from localStorage:', token);
    
    if (!token) {
      console.log('❌ No token found');
      return;
    }
    
    // Test 2: Try to get wishlist
    console.log('📋 Testing GET /api/wishlist...');
    const getResponse = await api.get('/wishlist');
    console.log('GET Response:', getResponse);
    console.log('GET Status:', getResponse.status);
    console.log('GET Data:', getResponse.data);
    
    // Test 3: Try to add to wishlist
    console.log('➕ Testing POST /api/wishlist/1...');
    const postResponse = await api.post('/wishlist/1', {});
    console.log('POST Response:', postResponse);
    console.log('POST Status:', postResponse.status);
    console.log('POST Data:', postResponse.data);
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
    if (error.config) {
      console.error('Error config:', error.config);
    }
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test
testWishlistAPI();
