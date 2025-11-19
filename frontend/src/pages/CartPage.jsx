import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { placeOrder } from '../services/api';


const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getSubtotal, getDeliveryPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const subtotal = getSubtotal();
  const deliveryPrice = getDeliveryPrice();
  const total = getTotalPrice();
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Check if user is logged in as customer
    if (!isLoggedIn || userRole !== 'customer') {
      toast.error('Please login as a customer to place an order');
      navigate('/auth/role');
      return;
    }
    
    setPlacing(true);
    try {
      // Place order via backend API
      const response = await placeOrder();
      
      console.log('Place order response:', response);
      console.log('Order items:', response.order.items);
      
      // Calculate total item count before clearing cart
      const totalItemCount = response.order.items.reduce((sum, item) => sum + item.quantity, 0);
      console.log('Total item count:', totalItemCount);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to checkout success page with order data
      toast.success('Order placed successfully!');
      navigate('/checkout-success', { 
        state: { 
          orderData: {
            orderId: response.order._id,
            items: response.order.items,
            total: response.order.totalAmount,
            subtotal: response.order.subtotal,
            deliveryPrice: response.order.deliveryPrice,
            orderDate: response.order.createdAt,
            deliveryAddress: response.order.deliveryAddress,
            itemCount: totalItemCount,
          } 
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // Determine the correct "Continue Shopping" link
  const continueShoppingLink = isLoggedIn && userRole === 'customer' 
    ? '/customer/vendors' 
    : '/browse/vendors';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h1 className="text-4xl font-display font-bold">Shopping Cart</h1>
        <Link to={continueShoppingLink}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="text-center py-16 animate-scale-in">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
          <Link to={continueShoppingLink}>
            <Button className="btn-hero">Browse Vendors</Button>
          </Link>
        </div>
      ) : (
        /* Cart Items */
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-muted rounded-lg p-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Total & Checkout Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mt-8 animate-fade-in">
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">Item Total</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold">₹{deliveryPrice}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-bold">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleCheckout}
                className="flex-1 btn-hero rounded-full"
                size="lg"
                disabled={placing}
              >
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Checkout'
                )}
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                size="lg"
                disabled={placing}
                className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md rounded-full px-8"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
