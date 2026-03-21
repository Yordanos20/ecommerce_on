import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('🛒 CartContext - saving to localStorage:', cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((p) => p.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + quantity }
            : p
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
    toast.info(`${product.name} removed from cart.`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setCartItems(cartItems.filter((p) => p.id !== productId));
      return;
    }
    setCartItems(
      cartItems.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cart: cartItems, // Alias for Navbar
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
