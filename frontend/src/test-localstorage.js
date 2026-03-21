// Test localStorage functionality
// Copy and paste this into your browser console

console.log('🔍 Testing localStorage...');

// Test 1: Check what's currently in localStorage
console.log('📦 Current localStorage:');
console.log('  simpleWishlist:', localStorage.getItem('simpleWishlist'));
console.log('  cart:', localStorage.getItem('cart'));

// Test 2: Try to manually add some test data
console.log('🧪 Adding test data...');
const testWishlist = [
  {id: 999, name: 'Test Product 1', price: 99.99},
  {id: 1000, name: 'Test Product 2', price: 149.99}
];

const testCart = [
  {id: 888, name: 'Test Cart Item 1', price: 79.99},
  {id: 889, name: 'Test Cart Item 2', price: 129.99}
];

// Save test data
localStorage.setItem('simpleWishlist', JSON.stringify(testWishlist));
localStorage.setItem('cart', JSON.stringify(testCart));

console.log('✅ Test data saved');

// Test 3: Read it back
console.log('📖 Reading back test data:');
const wishlistData = localStorage.getItem('simpleWishlist');
const cartData = localStorage.getItem('cart');

console.log('  Wishlist raw:', wishlistData);
console.log('  Cart raw:', cartData);

const wishlistCount = JSON.parse(wishlistData || '[]').length;
const cartCount = JSON.parse(cartData || '[]').length;

console.log('  Wishlist count:', wishlistCount);
console.log('  Cart count:', cartCount);

// Test 4: Test the badge functions
console.log('🎯 Testing badge functions:');
const getWishlistCount = () => {
  try {
    const data = localStorage.getItem('simpleWishlist');
    if (!data) return 0;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    console.error('Wishlist count error:', error);
    return 0;
  }
};

const getCartCount = () => {
  try {
    const data = localStorage.getItem('cart');
    if (!data) return 0;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    console.error('Cart count error:', error);
    return 0;
  }
};

console.log('  Badge wishlist count:', getWishlistCount());
console.log('  Badge cart count:', getCartCount());

console.log('🎉 Test complete! If you see the correct counts above, localStorage is working.');
console.log('📋 If badges still don\'t show after refresh, the issue is in the component rendering.');
