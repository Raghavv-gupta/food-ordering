import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Package, CheckCircle, Eye, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getVendorOrders, updateVendorOrderStatus } from '@/services/api';
import { toast } from 'sonner';

const VendorOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log('Dialog state changed:', dialogOpen, 'Selected order:', selectedOrder);
  }, [dialogOpen, selectedOrder]);

  const fetchOrders = async () => {
    try {
      const data = await getVendorOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await updateVendorOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    Pending: {
      icon: Clock,
      text: 'Pending',
      badge: 'secondary',
      nextStatus: 'Preparing',
      nextLabel: 'Start Preparing',
    },
    Preparing: {
      icon: Package,
      text: 'Preparing',
      badge: 'default',
      nextStatus: 'Out for Delivery',
      nextLabel: 'Out for Delivery',
    },
    'Out for Delivery': {
      icon: Package,
      text: 'Out for Delivery',
      badge: 'default',
      nextStatus: 'Delivered',
      nextLabel: 'Mark Delivered',
    },
    Delivered: {
      icon: CheckCircle,
      text: 'Delivered',
      badge: 'success',
      nextStatus: null,
      nextLabel: null,
    },
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.orderStatus?.toLowerCase() === status.toLowerCase());
  };

  const viewOrderDetails = (order) => {
    console.log('View order details clicked:', order);
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig['Pending'];
  };

  const OrderCard = ({ order }) => {
    const config = getStatusConfig(order.orderStatus);
    const StatusIcon = config.icon;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Order #{order._id?.slice(-6)}</CardTitle>
              <CardDescription>
                {order.customer?.name || 'Customer'} • {order.customer?.phone || 'N/A'}
              </CardDescription>
            </div>
            <Badge variant={config.badge}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {order.items?.length || 0} item(s) • ₹{order.totalAmount?.toFixed(2) || 0}
            </p>
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{order.deliveryAddress || 'No address provided'}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => viewOrderDetails(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            {config.nextStatus && (
              <Button 
                size="sm"
                onClick={() => handleStatusUpdate(order._id, config.nextStatus)}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                {config.nextLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage your incoming orders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="out for delivery">Out for Delivery</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filterOrders('all').length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No orders yet</CardContent></Card>
          ) : (
            filterOrders('all').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterOrders('pending').length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No pending orders</CardContent></Card>
          ) : (
            filterOrders('pending').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          {filterOrders('preparing').length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No orders in preparation</CardContent></Card>
          ) : (
            filterOrders('preparing').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="out for delivery" className="space-y-4">
          {filterOrders('out for delivery').length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No orders out for delivery</CardContent></Card>
          ) : (
            filterOrders('out for delivery').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filterOrders('delivered').length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No delivered orders</CardContent></Card>
          ) : (
            filterOrders('delivered').map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabsContent>
      </Tabs>
      )}

      {/* Order Details Dialog */}
      {dialogOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setDialogOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-sm text-muted-foreground">Order #{selectedOrder._id?.slice(-6)}</p>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Status</h3>
                <Badge variant={getStatusConfig(selectedOrder.orderStatus).badge}>
                  {getStatusConfig(selectedOrder.orderStatus).text}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p className="text-muted-foreground">{selectedOrder.customer?.name || 'Customer'}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer?.phone || 'N/A'}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toFixed(2) || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{selectedOrder.deliveryPrice?.toFixed(2) || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <h3 className="font-semibold text-lg">Total</h3>
                  <p className="font-bold text-lg">₹{selectedOrder.totalAmount?.toFixed(2) || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="flex items-start space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedOrder.deliveryAddress || 'No address provided'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Time</h3>
                <p className="text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              <button
                onClick={() => setDialogOpen(false)}
                className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
