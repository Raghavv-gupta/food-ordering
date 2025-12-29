import Customer from "../models/customer_model.js";
import Vendor from "../models/vendor_model.js";
import MenuItem from "../models/menuItem_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id, role: "customer" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Register a new customer
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    if (!name || !email || !password || !address || !phone) {
      return res.status(400).json({
        message: "Name, email, password, phone, and address are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Customer.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      address: address.trim(),
      phone: phone.trim(),
    });

    const savedCustomer = await newCustomer.save();
    const token = createToken(savedCustomer._id);

    const { password: _p, ...safeUser } = savedCustomer.toObject();

    res.status(201).json({
      message: "Customer registered",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("registerCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login customer
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const correct = await bcrypt.compare(password, customer.password);
    if (!correct) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(customer._id);
    const { password: _p, ...safeUser } = customer.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("loginCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in customer profile
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select(
      "-password -__v"
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (err) {
    console.error("getCustomerProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update customer profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { name, phone, address } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (address) updateData.address = address.trim();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    console.error("updateCustomerProfile:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// Get all vendors (public)
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "-password -email").sort({
      createdAt: -1,
    });

    res.status(200).json(vendors);
  } catch (err) {
    console.error("getAllVendors:", err);
    res.status(500).json({ message: "Server error while fetching vendors" });
  }
};

// Get vendor details + available items
export const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId).select(
      "shopName address deliveryPrice logo"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const menuItems = await MenuItem.find({
      vendor: vendorId,
      available: true,
    });

    res.status(200).json({ vendor, menuItems });
  } catch (err) {
    console.error("getVendorById:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching vendor details" });
  }
};

// Get vendor menu only
export const getVendorMenu = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId).select(
      "shopName address deliveryPrice logo"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const menuItems = await MenuItem.find({ vendor: vendorId });

    res.status(200).json({
      vendor,
      menu: menuItems,
    });
  } catch (err) {
    console.error("getVendorMenu:", err);
    res.status(500).json({ message: "Server error" });
  }
};
