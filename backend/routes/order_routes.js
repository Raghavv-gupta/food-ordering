import express from "express";
import authCustomer from "../middleware/customer_auth.js";

import {
  placeOrder,
  getCustomerOrders,
  getSingleOrder,
} from "../controllers/order_controller.js";

const router = express.Router();

// All order routes require customer authentication
router.use(authCustomer);

router.post("/place", placeOrder);
router.get("/my-orders", getCustomerOrders);
router.get("/order/:orderId", getSingleOrder);

export default router;
