import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Clock, MapPin, Phone, Mail, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.orderData) {
      console.log('Order data received:', location.state.orderData);
      console.log('Order items:', location.state.orderData.items);
      setOrderData(location.state.orderData);
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!orderData) {
    return null;
  }

  const estimatedTime = '30-40 minutes';
  const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            {/* Success Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Order Placed Successfully!
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Your delicious food is on its way
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center"
            >
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-2xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {orderId}
              </p>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="font-semibold text-lg">{orderData.itemCount || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-lg font-bold text-green-600">₹</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">₹{orderData.total}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-orange-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-semibold">{orderData.deliveryAddress || 'N/A'}</p>
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t pt-4"
            >
              <h3 className="font-semibold text-lg mb-3">Order Items</h3>
              <div className="space-y-2">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image || 'https://via.placeholder.com/50?text=Food'}
                        alt={item.itemName || item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-muted"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50?text=Food';
                        }}
                      />
                      <div>
                        <p className="font-medium">{item.itemName || item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 pt-4"
            >
              <Button
                onClick={() => navigate('/customer/orders')}
                className="w-full btn-hero rounded-full"
                size="lg"
              >
                <Package className="h-4 w-4 mr-2" />
                Track Your Order
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full rounded-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>

            {/* Thank You Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center pt-4 border-t"
            >
              <p className="text-muted-foreground">
                Thank you for your order!
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
