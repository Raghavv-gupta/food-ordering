import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("✅ Mongoose connection established");
  });

  mongoose.connection.on("error", (error) => {
    console.error("❌ Mongoose connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected");
  });
};

export default connectDB;
