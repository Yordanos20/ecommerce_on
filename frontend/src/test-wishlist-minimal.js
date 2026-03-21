// Test the simple wishlist functionality
// Copy and paste this into your browser console

console.log('🧪 Testing Simple Wishlist...');

// Test 1: Check if SimpleWishlistContext is available
try {
  // Test localStorage directly
  console.log('📦 Testing localStorage...');
  
  // Add test item
  const testProduct = {
    id: 999,
    name: 'Test Product',
    price: 99.99,
    image: 'https://via.placeholder.com/150'
  };
  
  localStorage.setItem('simpleWishlist', JSON.stringify([testProduct]));
  console.log('✅ Added test item to localStorage');
  
  // Retrieve item
  const savedWishlist = JSON.parse(localStorage.getItem('simpleWishlist') || '[]');
  console.log('📋 Retrieved wishlist:', savedWishlist);
  
  // Test toast notification
  if (typeof window !== 'undefined' && window.toast) {
    console.log('🔔 Toast available');
  } else {
    console.log('⚠️ Toast not available in this context');
  }
  
  // Test React context (if on a React page)
  if (typeof window !== 'undefined' && window.React) {
    console.log('⚛️ React detected');
  }
  
  console.log('✅ Simple wishlist test completed');
  
} catch (error) {
  console.error('❌ Test error:', error);
}

// Manual test for toast notifications
console.log('🔔 Testing toast notifications...');
try {
  // Try to trigger a toast notification
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.success('Test notification! ✅');
  } else {
    console.log('Toast not available - check if react-toastify is loaded');
  }
} catch (error) {
  console.error('Toast error:', error);
}
