import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  getVendorMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '@/services/api';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch menu items on component mount
  useEffect(() => {
    console.log('🚀 MenuItems component mounted');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    console.log('🔑 Token exists:', !!token);
    console.log('👤 User role:', userRole);
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching menu items...');
      const response = await getVendorMenuItems();
      console.log('Fetch response:', response);
      setMenuItems(response.menuItems || []);
    } catch (error) {
      console.error('Fetch error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    console.log('🔵 Add New button clicked');
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true,
    });
    setDialogOpen(true);
    console.log('🔵 Dialog should be open now');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      available: item.available,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    alert('Save button was clicked! Check console for details.');
    console.log('💾 Form data:', formData);
    console.log('💾 Dialog open state:', dialogOpen);
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      console.log('❌ Validation failed - missing fields');
      console.log('❌ Name:', formData.name);
      console.log('❌ Description:', formData.description);
      console.log('❌ Price:', formData.price);
      console.log('❌ Category:', formData.category);
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      console.log('❌ Validation failed - invalid price');
      toast.error('Please enter a valid price');
      return;
    }

    console.log('✅ Validation passed');
    setSaveLoading(true);
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: formData.available,
      };

      console.log('📤 Sending item data:', itemData);

      if (editingItem) {
        // Update existing item
        console.log('🔄 Updating item:', editingItem._id);
        const response = await updateMenuItem(editingItem._id, itemData);
        console.log('✅ Update response:', response);
        toast.success('Menu item updated successfully!');
      } else {
        // Add new item
        console.log('➕ Adding new item');
        const response = await addMenuItem(itemData);
        console.log('✅ Add response:', response);
        toast.success('Menu item added successfully!');
      }

      setDialogOpen(false);
      await fetchMenuItems(); // Refresh the list
    } catch (error) {
      console.error('❌ Save error:', error);
      console.error('❌ Error response:', error.response);
      toast.error(error.response?.data?.message || error.message || 'Failed to save menu item');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await deleteMenuItem(item._id);
      toast.success('Menu item deleted successfully!');
      fetchMenuItems(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateMenuItem(item._id, { ...item, available: !item.available });
      toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
      fetchMenuItems(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Items</h1>
          <p className="text-muted-foreground">Manage your restaurant menu</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No menu items yet. Add your first item!</p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          menuItems.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className="absolute top-2 right-2"
                  variant={item.available ? "default" : "secondary"}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-2xl font-bold text-primary">₹{item.price}</p>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border-2" style={{ borderColor: item.available ? '#22c55e' : '#d1d5db' }}>
                  <div className="flex flex-col">
                    <Label htmlFor={`available-${item._id}`} className="font-semibold cursor-pointer" style={{ color: item.available ? '#22c55e' : '#6b7280' }}>
                      {item.available ? '✓ Available' : '✕ Unavailable'}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {item.available ? 'Customers can order this item' : 'Hidden from customers'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.available && <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>}
                    <Switch
                      id={`available-${item._id}`}
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item)}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Item Modal - Custom Implementation */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialogOpen(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-orange-500 to-red-500">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <p className="text-white/90 mt-1">Fill in the details for your menu item</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Margherita Pizza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your dish"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-700 font-semibold">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="199"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-700 font-semibold">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Pizza, Burgers, Indian, Chinese, etc."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-700 font-semibold">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border-2"
                />
                <p className="text-xs text-gray-500">Enter a direct URL to your food image</p>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available" className="text-gray-700">Available for order</Label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)} 
                disabled={saveLoading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saveLoading}
                className="px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingItem ? 'Update' : 'Add'} Item</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
