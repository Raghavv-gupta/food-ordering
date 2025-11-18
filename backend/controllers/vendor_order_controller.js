import Order from "../models/order_model.js";

// Get all orders for a vendor
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await Order.find({ vendor: vendorId })
      .populate('customer', 'name phone email')
      .populate('items.menuItem', 'itemName price')
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching vendor orders",
      error: err.message,
    });
  }
};

// Get a single order for a vendor
export const getSingleVendorOrder = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      vendor: vendorId,
    });

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

// Update order status (step-by-step)
export const updateOrderStatus = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const order = await Order.findOne({
      _id: orderId,
      vendor: vendorId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const current = order.orderStatus;

    const nextStatus = {
      Pending: "Preparing",
      Preparing: "Out for Delivery",
      "Out for Delivery": "Delivered",
    };

    if (nextStatus[current] !== newStatus) {
      return res.status(400).json({
        message: `Invalid transition: ${current} → ${newStatus}. Allowed: ${current} → ${nextStatus[current]}`,
      });
    }

    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating order status",
      error: err.message,
    });
  }
};
