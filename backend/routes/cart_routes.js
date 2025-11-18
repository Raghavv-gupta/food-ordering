import express from "express";
import authCustomer from "../middleware/customer_auth.js";

import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCustomerCart,
  clearCart,
} from "../controllers/cart_controller.js";

const router = express.Router();

// All cart routes require customer authentication
router.use(authCustomer);

router.post("/add", addItemToCart);
router.get("/", getCustomerCart);
router.post("/remove", removeItemFromCart);
router.post("/update", updateCartItemQuantity);
router.post("/clear", clearCart);

export default router;
