import Cart from "../models/cart_model.js";
import MenuItem from "../models/menuItem_model.js";

// Helper: get existing cart or create a new one
const getOrCreateCart = async (customerId) => {
  let cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    cart = await Cart.create({ customer: customerId, items: [] });
  }
  return cart;
};

// Add item to cart (single vendor rule)
export const addItemToCart = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { itemId, quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const item = await MenuItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (!item.available) {
      return res.status(400).json({ message: "Item is not available" });
    }

    let cart = await getOrCreateCart(customerId);

    // Enforce single vendor cart
    if (cart.items.length > 0) {
      const firstItem = await MenuItem.findById(cart.items[0].item);

      if (firstItem.vendor.toString() !== item.vendor.toString()) {
        return res.status(400).json({
          message: "You can add items from only one vendor at a time.",
        });
      }
    }

    // Add item or increase quantity
    const existing = cart.items.find((i) => i.item.toString() === itemId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ item: itemId, quantity });
    }

    await cart.save();
    await cart.populate("items.item");

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove an item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.item.toString() !== itemId);

    await cart.save();
    await cart.populate("items.item");

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({
      message: "Error removing item",
      error: err.message,
    });
  }
};

// Update item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { itemId, quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existing = cart.items.find((i) => i.item.toString() === itemId);
    if (!existing) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    existing.quantity = quantity;

    await cart.save();
    await cart.populate("items.item");

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({
      message: "Error updating quantity",
      error: err.message,
    });
  }
};

// Get customer cart
export const getCustomerCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.customerId);
    await cart.populate("items.item");

    const subtotal = cart.items.reduce(
      (sum, i) => sum + i.item.price * i.quantity,
      0
    );

    res.status(200).json({
      cart,
      summary: {
        itemCount: cart.items.reduce((n, i) => n + i.quantity, 0),
        distinctItems: cart.items.length,
        subtotal,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching cart",
      error: err.message,
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    await cart.populate("items.item");

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({
      message: "Error clearing cart",
      error: err.message,
    });
  }
};
