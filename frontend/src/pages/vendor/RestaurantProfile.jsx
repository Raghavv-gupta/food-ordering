import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Store, Phone, MapPin, Image, DollarSign, User } from 'lucide-react';
import { toast } from 'sonner';
import { getVendorProfile, updateVendorProfile } from '@/services/api';

const RestaurantProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    phone: '',
    address: '',
    logo: '',
    deliveryPrice: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getVendorProfile();
      setFormData({
        name: data.vendor.name || '',
        shopName: data.vendor.shopName || '',
        phone: data.vendor.phone || '',
        address: data.vendor.address || '',
        logo: data.vendor.logo || '',
        deliveryPrice: data.vendor.deliveryPrice || 0,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.shopName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await updateVendorProfile(formData);
      toast.success('Profile updated successfully!');
      
      // Update localStorage with new vendor data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...response.vendor };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Restaurant Profile</h1>
        <p className="text-muted-foreground">Update your restaurant information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Manage your restaurant details visible to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Owner Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Shop Name */}
            <div className="space-y-2">
              <Label htmlFor="shopName" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Restaurant / Shop Name *
              </Label>
              <Input
                id="shopName"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Your restaurant name"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 1234567890"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full business address"
                required
              />
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logo" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Logo Image URL
              </Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              {formData.logo && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Delivery Price */}
            <div className="space-y-2">
              <Label htmlFor="deliveryPrice" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Delivery Charge (₹)
              </Label>
              <Input
                id="deliveryPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.deliveryPrice}
                onChange={(e) => setFormData({ ...formData, deliveryPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                The delivery fee charged to customers for orders from your restaurant
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} size="lg">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default RestaurantProfile;
