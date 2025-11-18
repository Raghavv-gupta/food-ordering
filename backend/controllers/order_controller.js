import Cart from "../models/cart_model.js";
import Order from "../models/order_model.js";
import Customer from "../models/customer_model.js";
import Vendor from "../models/vendor_model.js";
import MenuItem from "../models/menuItem_model.js";

// Place an order
export const placeOrder = async (req, res) => {
  try {
    const customerId = req.customerId;

    // Customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Cart with populated items
    const cart = await Cart.findOne({ customer: customerId }).populate(
      "items.item"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Vendor (based on first item)
    const vendorId = cart.items[0].item.vendor;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Build snapshot of ordered items + calculate subtotal
    let subtotal = 0;
    const orderItems = cart.items.map((cartItem) => {
      const item = cartItem.item;
      subtotal += item.price * cartItem.quantity;

      return {
        menuItem: item._id,
        itemName: item.itemName,
        price: item.price,
        quantity: cartItem.quantity,
      };
    });

    const deliveryPrice = vendor.deliveryPrice || 0;
    const totalAmount = subtotal + deliveryPrice;

    // Create order
    const newOrder = await Order.create({
      customer: customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address,

      vendor: vendor._id,

      items: orderItems,
      subtotal,
      deliveryPrice,
      totalAmount,

      paymentMethod: "COD",
      orderStatus: "Pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error placing order",
      error: err.message,
    });
  }
};

// Get all orders for a customer
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.customerId;

    const orders = await Order.find({ customer: customerId })
      .populate('vendor', 'shopName logo deliveryPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    });
  }
};

// Get a single order
export const getSingleOrder = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
    }).populate("vendor", "shopName address phone logo");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching order",
      error: err.message,
    });
  }
};
