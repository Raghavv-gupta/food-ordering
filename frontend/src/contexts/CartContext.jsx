import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getCart, 
  addItemToCart, 
  removeItemFromCart, 
  updateCartItemQuantity, 
  clearCart as clearCartAPI,
  getVendorById
} from '@/services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartSummary, setCartSummary] = useState({ subtotal: 0, deliveryPrice: 0 });

  // Fetch cart from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole === 'customer') {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      // Transform backend cart structure to match frontend
      const transformedCart = data.cart.items.map(item => ({
        id: item.item._id,
        _id: item.item._id,
        name: item.item.itemName,
        itemName: item.item.itemName,
        price: item.item.price,
        quantity: item.quantity,
        image: item.item.image,
        category: item.item.category,
        available: item.item.available,
        vendor: item.item.vendor,
      }));
      setCart(transformedCart);
      
      // Store summary with subtotal
      setCartSummary({
        subtotal: data.summary?.subtotal || 0,
        deliveryPrice: 0, // Will be fetched from vendor
      });
      
      // Fetch vendor delivery price if cart has items
      if (transformedCart.length > 0 && transformedCart[0].vendor) {
        try {
          const vendorData = await getVendorById(transformedCart[0].vendor);
          setCartSummary(prev => ({
            ...prev,
            deliveryPrice: vendorData.vendor?.deliveryPrice || 0,
          }));
        } catch (error) {
          console.error('Error fetching vendor delivery price:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If not logged in or error, use empty cart
      setCart([]);
      setCartSummary({ subtotal: 0, deliveryPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'customer') {
      toast.error('Please login as customer to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const quantity = item.quantity || 1;
      await addItemToCart(item._id, quantity);
      toast.success(`${item.itemName || item.name} (${quantity}) added to cart!`);
      await fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    try {
      setLoading(true);
      const item = cart.find(cartItem => cartItem.id === id || cartItem._id === id);
      await removeItemFromCart(id);
      if (item) {
        toast.info(`${item.name || item.itemName} removed from cart`);
      }
      await fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    
    try {
      setLoading(true);
      await updateCartItemQuantity(id, quantity);
      await fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await clearCartAPI();
      setCart([]);
      toast.info('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartSummary.subtotal + cartSummary.deliveryPrice;
  };
  
  const getSubtotal = () => {
    return cartSummary.subtotal;
  };
  
  const getDeliveryPrice = () => {
    return cartSummary.deliveryPrice;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleLike = (id) => {
    setLikes((prevLikes) => {
      if (prevLikes.includes(id)) {
        return prevLikes.filter((likeId) => likeId !== id);
      }
      toast.success('Added to favorites!');
      return [...prevLikes, id];
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        getTotalPrice,
        getSubtotal,
        getDeliveryPrice,
        getTotalItems,
        likes,
        toggleLike,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
