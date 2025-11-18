import express from "express";
import { verifyVendorJWT } from "../middleware/vendor_auth.js";

import {
  getVendorOrders,
  getSingleVendorOrder,
  updateOrderStatus,
} from "../controllers/vendor_order_controller.js";

const router = express.Router();

// Vendor authentication for all routes
router.use(verifyVendorJWT);

router.get("/orders", getVendorOrders);
router.get("/orders/:orderId", getSingleVendorOrder);
router.patch("/orders/:orderId/status", updateOrderStatus);

export default router;
