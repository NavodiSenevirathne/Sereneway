// context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store email in localStorage for persistence
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('cartUserEmail') || '';
  });

  // Update localStorage when email changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('cartUserEmail', userEmail);
    }
  }, [userEmail]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we have an email
      if (userEmail) {
        const response = await axios.get(`/api/cart?email=${encodeURIComponent(userEmail)}`);
        const items = response.data.data || [];
        setCartItems(items);
        setCartCount(items.length);
      } else {
        // No email means empty cart
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when email changes
  useEffect(() => {
    fetchCart();
  }, [userEmail]);

  const addToCart = async (item) => {
    try {
      // Make sure item has email
      const itemWithEmail = {
        ...item,
        email: userEmail || item.email
      };
      
      // If we don't have a user email yet, set it from this item
      if (!userEmail && item.email) {
        setUserEmail(item.email);
      }
      
      const response = await axios.post("/api/cart", itemWithEmail);
      
      if (response.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateCartItem = async (itemId, updatedData) => {
    try {
      await axios.put(`/api/cart/${itemId}`, {
        ...updatedData,
        email: userEmail
      });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      // We need to add this endpoint to delete all items for an email
      await axios.delete(`/api/cart?email=${encodeURIComponent(userEmail)}`);
      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        error,
        userEmail,
        setUserEmail,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
