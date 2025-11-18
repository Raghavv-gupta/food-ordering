import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Star, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { getAllVendors } from "../../services/api";
import { toast } from "sonner";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await getAllVendors();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          All Vendors
        </h1>
        <p className="text-muted-foreground">
          Browse through our amazing selection of restaurants and food vendors. 
          Order from your favorite or discover something new!
        </p>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
            <Card 
              key={vendor._id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Vendor Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.shopName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🍽️
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{vendor.shopName}</CardTitle>
                <CardDescription className="text-base">
                  {vendor.address || 'Delicious food delivered to you'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Delivery Price */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">Delivery: ₹{vendor.deliveryPrice || 0}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="line-clamp-1">{vendor.address || 'Location not specified'}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Link to={`/customer/vendor/${vendor._id}`} className="w-full">
                  <Button className="w-full group/btn">
                    View Menu
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Empty State (if no vendors) */}
      {vendors.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            No vendors available at the moment. Please check back later!
          </p>
        </div>
      )}
    </div>
  );
};

export default AllVendors;
