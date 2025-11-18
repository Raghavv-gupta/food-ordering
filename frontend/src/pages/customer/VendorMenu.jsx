import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, MapPin, Loader2, Plus, Minus } from 'lucide-react';
import { getVendorMenu } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const VendorMenu = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchVendorMenu();
  }, [vendorId]);

  const fetchVendorMenu = async () => {
    try {
      const data = await getVendorMenu(vendorId);
      setVendor(data.vendor);
      setMenuItems(data.menu || []);
    } catch (error) {
      console.error('Error fetching vendor menu:', error);
      toast.error('Failed to load vendor menu');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return {
        ...prev,
        [itemId]: newQty
      };
    });
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login/customer');
      return;
    }

    addToCart({
      ...item,
      quantity: quantity,
      vendorId: vendorId,
      vendorName: vendor?.shopName
    });
    
    setQuantities(prev => ({ ...prev, [item._id]: 1 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Vendor not found</p>
        <Button onClick={() => navigate('/customer/vendors')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customer/vendors')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {vendor.shopName}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{vendor.address}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Delivery Fee: ₹{vendor.deliveryPrice || 0}
          </p>
        </div>
      </div>

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            No menu items available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const quantity = quantities[item._id] || 0;
            
            return (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-all">
                {/* Item Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
                    {item.category}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{item.itemName}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description || 'Delicious food item'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                    {item.available && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Available
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  {item.available && (
                    <>
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          disabled={quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {quantity || 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className="flex-1"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </>
                  )}
                  {!item.available && (
                    <Button disabled className="w-full">
                      Out of Stock
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorMenu;
