import Vendor from "../models/vendor_model.js";
import MenuItem from "../models/menuItem_model.js";
import Order from "../models/order_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Register a new vendor
export const registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      shopName,
      phone,
      address,
      deliveryPrice,
      logo,
    } = req.body;

    if (!name || !email || !password || !shopName || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingVendor = await Vendor.findOne({
      $or: [{ email: normalizedEmail }, { shopName }],
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Vendor with this email or shop name already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newVendor = new Vendor({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      shopName: shopName.trim(),
      phone: phone || "",
      address: address || "",
      deliveryPrice: deliveryPrice || 0,
      logo: logo || "",
    });

    await newVendor.save();

    const token = jwt.sign(
      { id: newVendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Vendor registered successfully",
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        shopName: newVendor.shopName,
        phone: newVendor.phone,
        address: newVendor.address,
        deliveryPrice: newVendor.deliveryPrice,
        logo: newVendor.logo,
      },
      token,
    });
  } catch (err) {
    console.error("registerVendor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login vendor
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const vendor = await Vendor.findOne({ email: normalizedEmail });

    if (!vendor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, vendor.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        shopName: vendor.shopName,
        phone: vendor.phone,
        address: vendor.address,
        logo: vendor.logo,
        deliveryPrice: vendor.deliveryPrice,
      },
      token,
    });
  } catch (err) {
    console.error("loginVendor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get vendor profile
export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const vendor = await Vendor.findById(vendorId).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

// Add menu item
export const addMenuItem = async (req, res) => {
  try {
    console.log('Add menu item request received');
    console.log('Vendor ID:', req.vendor?.id);
    console.log('Request body:', req.body);
    
    const vendorId = req.vendor.id;
    const { itemName, description, price, category, available, image } =
      req.body;

    if (!itemName || !description || !price || !category || !image) {
      return res.status(400).json({
        message:
          "All fields (itemName, description, price, category, image) are required",
      });
    }

    const newItem = new MenuItem({
      vendor: vendorId,
      itemName: itemName.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      available: available ?? true,
      image: image.trim(),
    });

    console.log('Saving new item:', newItem);
    await newItem.save();
    console.log('Item saved successfully');

    res.status(201).json({
      message: "Menu item added successfully",
      item: newItem,
    });
  } catch (err) {
    console.error('Add menu item error:', err);
    res.status(500).json({
      message: "Failed to add menu item",
      error: err.message,
    });
  }
};

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const items = await MenuItem.find({ vendor: vendorId });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch menu items",
      error: err.message,
    });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { itemId } = req.params;

    const allowedFields = [
      "itemName",
      "description",
      "price",
      "category",
      "available",
      "image",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const item = await MenuItem.findOneAndUpdate(
      { _id: itemId, vendor: vendorId },
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update menu item",
      error: err.message,
    });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { itemId } = req.params;

    const deletedItem = await MenuItem.findOneAndDelete({
      _id: itemId,
      vendor: vendorId,
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Menu item not found or unauthorized" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete menu item",
      error: err.message,
    });
  }
};

// Update delivery price
export const updateDeliveryPrice = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { deliveryPrice } = req.body;

    if (deliveryPrice == null) {
      return res.status(400).json({ message: "Delivery price is required" });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { deliveryPrice },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Delivery price updated successfully",
      deliveryPrice: updatedVendor.deliveryPrice,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update delivery price",
      error: err.message,
    });
  }
};

// Update vendor profile
export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { name, shopName, phone, address, logo, deliveryPrice } = req.body;

    // Check if shopName is being changed and if it's already taken by another vendor
    if (shopName) {
      const existingVendor = await Vendor.findOne({
        shopName: shopName.trim(),
        _id: { $ne: vendorId }
      });

      if (existingVendor) {
        return res.status(400).json({ message: "Shop name already taken" });
      }
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (shopName) updateData.shopName = shopName.trim();
    if (phone) updateData.phone = phone.trim();
    if (address) updateData.address = address.trim();
    if (logo !== undefined) updateData.logo = logo;
    if (deliveryPrice !== undefined) updateData.deliveryPrice = deliveryPrice;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    // Get current date and date 30 days ago for comparison
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Total orders count (all time)
    const totalOrders = await Order.countDocuments({ vendor: vendorId });

    // Orders in last 30 days
    const recentOrders = await Order.countDocuments({
      vendor: vendorId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Orders in previous 30 days (30-60 days ago)
    const previousOrders = await Order.countDocuments({
      vendor: vendorId,
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    // Calculate order change percentage
    const orderChange = previousOrders > 0 
      ? (((recentOrders - previousOrders) / previousOrders) * 100).toFixed(1)
      : recentOrders > 0 ? '+100' : '0';

    // Total revenue (all time)
    const revenueData = await Order.aggregate([
      { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Recent revenue (last 30 days)
    const recentRevenueData = await Order.aggregate([
      { 
        $match: { 
          vendor: new mongoose.Types.ObjectId(vendorId),
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const recentRevenue = recentRevenueData[0]?.total || 0;

    // Previous revenue (30-60 days ago)
    const previousRevenueData = await Order.aggregate([
      { 
        $match: { 
          vendor: new mongoose.Types.ObjectId(vendorId),
          createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const previousRevenue = previousRevenueData[0]?.total || 0;

    // Calculate revenue change percentage
    const revenueChange = previousRevenue > 0 
      ? (((recentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : recentRevenue > 0 ? '+100' : '0';

    // Get unique customers count
    const uniqueCustomers = await Order.distinct('customer', { vendor: vendorId });
    const totalCustomers = uniqueCustomers.length;

    // Recent customers (last 30 days)
    const recentCustomersData = await Order.distinct('customer', {
      vendor: vendorId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    const recentCustomersCount = recentCustomersData.length;

    // Previous customers (30-60 days ago)
    const previousCustomersData = await Order.distinct('customer', {
      vendor: vendorId,
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    const previousCustomersCount = previousCustomersData.length;

    // Calculate customer change
    const customerChange = previousCustomersCount > 0 
      ? (((recentCustomersCount - previousCustomersCount) / previousCustomersCount) * 100).toFixed(1)
      : recentCustomersCount > 0 ? '+100' : '0';

    // Get vendor delivery price
    const vendor = await Vendor.findById(vendorId);
    const deliveryPrice = vendor.deliveryPrice || 0;

    // Get recent orders for display (last 5)
    const recentOrdersList = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name phone email')
      .select('_id customer customerName customerPhone items subtotal deliveryPrice totalAmount orderStatus createdAt');

    // Format recent orders
    const formattedOrders = recentOrdersList.map(order => ({
      id: order._id,
      orderId: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
      customer: order.customer?.name || order.customerName,
      customerPhone: order.customer?.phone || order.customerPhone,
      items: order.items.length,
      amount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.createdAt
    }));

    res.status(200).json({
      stats: {
        totalOrders,
        orderChange: orderChange >= 0 ? `+${orderChange}%` : `${orderChange}%`,
        totalRevenue,
        revenueChange: revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`,
        deliveryPrice: deliveryPrice,
        totalCustomers,
        customerChange: customerChange >= 0 ? `+${customerChange}` : `${customerChange}`,
      },
      recentOrders: formattedOrders
    });

  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: err.message,
    });
  }
};
