// Test authentication in browser console
// Copy and paste this into your browser console when logged in

console.log('🔍 Testing Authentication...');

// Check if user is logged in
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token:', token);
console.log('User:', user ? JSON.parse(user) : null);

// Test API call if token exists
if (token) {
  fetch('http://localhost:5000/api/wishlist', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => console.log('Wishlist data:', data))
  .catch(error => console.error('API error:', error));
} else {
  console.log('❌ No token found - please login first');
}

// Test if AuthContext is working
if (typeof window !== 'undefined' && window.React) {
  console.log('React detected');
}
