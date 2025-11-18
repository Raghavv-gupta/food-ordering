import express from "express";
import {
  registerVendor,
  loginVendor,
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  updateDeliveryPrice,
  updateVendorProfile,
  getVendorProfile,
  getDashboardStats,
} from "../controllers/vendor_controller.js";
import { verifyVendorJWT } from "../middleware/vendor_auth.js";

const router = express.Router();

// Auth
router.post("/signup", registerVendor);
router.post("/login", loginVendor);

// Vendor profile
router.get("/profile", verifyVendorJWT, getVendorProfile);
router.put("/profile", verifyVendorJWT, updateVendorProfile);

// Dashboard stats
router.get("/dashboard/stats", verifyVendorJWT, getDashboardStats);

// Menu management
router.post("/menu", verifyVendorJWT, addMenuItem);
router.get("/menu", verifyVendorJWT, getMenuItems);
router.put("/menu/:itemId", verifyVendorJWT, updateMenuItem);
router.delete("/menu/:itemId", verifyVendorJWT, deleteMenuItem);

// Update delivery price
router.put("/update-delivery-price", verifyVendorJWT, updateDeliveryPrice);

export default router;
