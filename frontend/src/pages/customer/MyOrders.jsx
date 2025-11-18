import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Package, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { getCustomerOrders } from '@/services/api';
import { toast } from 'sonner';

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getCustomerOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Orders fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    Pending: {
      icon: Clock,
      color: 'bg-yellow-500',
      text: 'Pending',
      badge: 'secondary',
    },
    Preparing: {
      icon: Package,
      color: 'bg-blue-500',
      text: 'Preparing',
      badge: 'default',
    },
    'Out for Delivery': {
      icon: Package,
      color: 'bg-purple-500',
      text: 'Out for Delivery',
      badge: 'default',
    },
    Delivered: {
      icon: CheckCircle,
      color: 'bg-green-500',
      text: 'Delivered',
      badge: 'success',
    },
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.orderStatus.toLowerCase() === status.toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const OrderCard = ({ order }) => {
    const config = statusConfig[order.orderStatus] || statusConfig.Pending;
    const StatusIcon = config.icon;
    const orderId = `ORD-${order._id.slice(-6).toUpperCase()}`;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{order.vendor?.shopName || 'Restaurant'}</CardTitle>
              <CardDescription>Order #{orderId}</CardDescription>
            </div>
            <Badge variant={config.badge}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {order.items.length} item(s) • ₹{order.totalAmount}
            </p>
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{order.deliveryAddress}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => viewOrderDetails(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            {order.orderStatus === 'Delivered' && (
              <Button variant="outline" size="sm">
                Reorder
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders('all').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterOrders('pending').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No pending orders</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders('pending').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          {filterOrders('preparing').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No orders in preparation</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders('preparing').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filterOrders('delivered').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No delivered orders</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders('delivered').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      {dialogOpen && selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" onClick={() => setDialogOpen(false)}>
          <div className="relative z-[10000] bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-muted-foreground">Order #{`ORD-${selectedOrder._id.slice(-6).toUpperCase()}`}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Status</h3>
                <Badge variant={statusConfig[selectedOrder.orderStatus]?.badge || 'secondary'}>
                  {statusConfig[selectedOrder.orderStatus]?.text || selectedOrder.orderStatus}
                </Badge>
              </div>

              {/* Vendor Info */}
              <div>
                <h3 className="font-semibold mb-2">Restaurant</h3>
                <p className="text-muted-foreground">{selectedOrder.vendor?.shopName || 'Restaurant'}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{selectedOrder.deliveryPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <h3 className="font-semibold text-lg">Total</h3>
                  <p className="font-bold text-lg">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="flex items-start space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedOrder.deliveryAddress}</span>
                </div>
              </div>

              {/* Order Date */}
              <div>
                <h3 className="font-semibold mb-2">Order Date</h3>
                <p className="text-muted-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-muted-foreground">{selectedOrder.customerName}</p>
                <p className="text-muted-foreground">{selectedOrder.customerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
