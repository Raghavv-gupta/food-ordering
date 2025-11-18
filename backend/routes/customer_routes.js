import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  getAllVendors,
  getVendorById,
  getVendorMenu,
} from "../controllers/customer_controller.js";
import authCustomer from "../middleware/customer_auth.js";

const router = express.Router();

// Auth routes
router.post("/signup", registerCustomer);
router.post("/login", loginCustomer);
router.get("/profile", authCustomer, getCustomerProfile);
router.put("/profile", authCustomer, updateCustomerProfile);

// Public vendor browsing
router.get("/vendors", getAllVendors);
router.get("/vendors/:vendorId", getVendorById);
router.get("/vendors/:vendorId/menu", getVendorMenu);

export default router;
