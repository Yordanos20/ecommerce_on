// frontend/src/context/CartContextRobust.js
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProviderRobust = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage immediately
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("CartProviderRobust: Initial cart loaded from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("CartProviderRobust: Error loading initial cart:", error);
      localStorage.removeItem("cart");
    }
    return [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log("CartProviderRobust: Cart saved to localStorage:", cartItems);
    } catch (error) {
      console.error("CartProviderRobust: Error saving cart:", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    console.log("CartProviderRobust: Adding to cart:", product, "quantity:", quantity);
    
    setCartItems(prevItems => {
      const existing = prevItems.find((p) => p.id === product.id);
      let newItems;
      
      if (existing) {
        newItems = prevItems.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + quantity }
            : p
        );
        console.log("CartProviderRobust: Updated existing item quantity");
      } else {
        newItems = [...prevItems, { ...product, quantity }];
        console.log("CartProviderRobust: Added new item to cart");
      }
      
      // Force immediate localStorage save
      try {
        localStorage.setItem("cart", JSON.stringify(newItems));
        console.log("CartProviderRobust: Cart immediately saved to localStorage:", newItems);
      } catch (error) {
        console.error("CartProviderRobust: Error in immediate save:", error);
      }
      
      return newItems;
    });
    
    toast.success(`${product.name} added to cart!`);
  }, []);

  const removeFromCart = useCallback((product) => {
    console.log("CartProviderRobust: Removing from cart:", product);
    
    setCartItems(prevItems => {
      const newItems = prevItems.filter((item) => item.id !== product.id);
      console.log("CartProviderRobust: Item removed, new cart:", newItems);
      
      // Force immediate localStorage save
      try {
        localStorage.setItem("cart", JSON.stringify(newItems));
      } catch (error) {
        console.error("CartProviderRobust: Error in immediate save:", error);
      }
      
      return newItems;
    });
    
    toast.info(`${product.name} removed from cart.`);
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    console.log("CartProviderRobust: Updating quantity:", productId, "to:", quantity);
    
    if (quantity < 1) {
      setCartItems(prevItems => {
        const newItems = prevItems.filter((p) => p.id !== productId);
        try {
          localStorage.setItem("cart", JSON.stringify(newItems));
        } catch (error) {
          console.error("CartProviderRobust: Error in immediate save:", error);
        }
        return newItems;
      });
      return;
    }
    
    setCartItems(prevItems => {
      const newItems = prevItems.map((p) => (p.id === productId ? { ...p, quantity } : p));
      try {
        localStorage.setItem("cart", JSON.stringify(newItems));
      } catch (error) {
        console.error("CartProviderRobust: Error in immediate save:", error);
      }
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log("CartProviderRobust: Clearing cart");
    setCartItems([]);
    try {
      localStorage.setItem("cart", JSON.stringify([]));
    } catch (error) {
      console.error("CartProviderRobust: Error clearing cart:", error);
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Log current state
  useEffect(() => {
    console.log("CartProviderRobust: Current cart state:", cartItems);
    console.log("CartProviderRobust: localStorage cart:", localStorage.getItem("cart"));
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    cart: cartItems, // Alias for Navbar
  };

  console.log("CartProviderRobust: Providing context with:", value);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
