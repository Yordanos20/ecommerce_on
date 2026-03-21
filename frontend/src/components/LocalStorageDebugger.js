import React, { useState, useEffect } from 'react';

export default function LocalStorageDebugger() {
  const [cartData, setCartData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    const updateData = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('simpleWishlist') || '[]');
        setCartData(cart);
        setWishlistData(wishlist);
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
    };

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 LocalStorage Debugger</h4>
      <div><strong>Cart Items:</strong> {cartData.length}</div>
      <div><strong>Wishlist Items:</strong> {wishlistData.length}</div>
      <div style={{marginTop: '10px', fontSize: '10px'}}>
        <div><strong>Cart:</strong></div>
        {cartData.map((item, i) => (
          <div key={i}>- {item.name} (ID: {item.id})</div>
        ))}
        <div style={{marginTop: '5px'}}><strong>Wishlist:</strong></div>
        {wishlistData.map((item, i) => (
          <div key={i}>- {item.name} (ID: {item.id})</div>
        ))}
      </div>
    </div>
  );
}
