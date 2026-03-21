// frontend/src/context/CartContextFixed.js
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProviderFixed = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log("CartProvider: Initializing cart...");
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsedCart = JSON.parse(saved);
        console.log("CartProvider: Loaded cart from localStorage:", parsedCart);
        setCartItems(parsedCart);
      } else {
        console.log("CartProvider: No saved cart found");
      }
    } catch (e) {
      console.error("CartProvider: Error loading cart:", e);
      localStorage.removeItem("cart");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("CartProvider: Cart changed, saving to localStorage:", cartItems);
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log("CartProvider: Cart saved to localStorage");
    } catch (e) {
      console.error("CartProvider: Error saving cart:", e);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    console.log("CartProvider: Adding to cart:", product, quantity);
    setCartItems(prevItems => {
      const existing = prevItems.find((p) => p.id === product.id);
      let newItems;
      
      if (existing) {
        newItems = prevItems.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + quantity }
            : p
        );
        console.log("CartProvider: Updated existing item quantity");
      } else {
        newItems = [...prevItems, { ...product, quantity }];
        console.log("CartProvider: Added new item to cart");
      }
      
      return newItems;
    });
    toast.success(`${product.name} added to cart!`);
  }, []);

  const removeFromCart = useCallback((product) => {
    console.log("CartProvider: Removing from cart:", product);
    setCartItems(prevItems => {
      const newItems = prevItems.filter((item) => item.id !== product.id);
      console.log("CartProvider: Item removed, new cart:", newItems);
      return newItems;
    });
    toast.info(`${product.name} removed from cart.`);
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    console.log("CartProvider: Updating quantity:", productId, quantity);
    if (quantity < 1) {
      setCartItems(prevItems => {
        const newItems = prevItems.filter((p) => p.id !== productId);
        console.log("CartProvider: Item removed due to zero quantity");
        return newItems;
      });
      return;
    }
    setCartItems(prevItems =>
      prevItems.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  }, []);

  const clearCart = useCallback(() => {
    console.log("CartProvider: Clearing cart");
    setCartItems([]);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    cart: cartItems, // Alias for Navbar
  };

  console.log("CartProvider: Current cart state:", cartItems);
  console.log("CartProvider: Cart context value:", value);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
