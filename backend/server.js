// server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import vendorRoutes from "./routes/vendor_routes.js";
import vendorOrderRoutes from "./routes/vendor_order_routes.js";
import customerRoutes from "./routes/customer_routes.js";
import cartRoutes from "./routes/cart_routes.js";
import orderRoutes from "./routes/order_routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("🍴 Local Food Ordering System API is running...");
});

// Vendor auth & menu routes
app.use("/api/vendor", vendorRoutes);

// Vendor order routes
app.use("/api/vendor", vendorOrderRoutes);

// Customer routes
app.use("/api/customers", customerRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

// Customer order routes
app.use("/api/order", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
