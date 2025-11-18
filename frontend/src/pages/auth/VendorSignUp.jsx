import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChefHat,
  Mail,
  Lock,
  Home,
  User,
  Phone,
  DollarSign,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { vendorSignup, saveAuthData } from "@/services/api";

const VendorSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    email: "",
    phone: "",
    address: "",
    deliveryPrice: 0,
    logo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.shopName || !formData.email || !formData.password || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await vendorSignup(formData);
      saveAuthData(response.token, response.vendor, "vendor");
      toast.success("Vendor account created successfully!");
      navigate("/vendor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-400 to-red-600 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl p-8 rounded-2xl w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="bg-white/30 p-3 rounded-full"
          >
            <ChefHat className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white">Vendor Sign Up ✨</h2>
          <p className="text-white/80 text-sm">Start selling on FoodHub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          {/* Shop Name */}
          <div className="relative">
            <Home className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Restaurant / Shop Name"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="email"
              placeholder="Business Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
              required
            />
          </div>

          {/* Address */}
          <div className="relative">
            <Home className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Business Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
              required
            />
          </div>

          {/* Logo URL */}
          <div className="relative">
            <Image className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="url"
              placeholder="Logo Image URL (optional)"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          {/* Delivery Price */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-white/70 font-bold text-lg">
              ₹
            </span>
            <input
              type="number"
              placeholder="Delivery Charge (optional)"
              value={formData.deliveryPrice}
              onChange={(e) => setFormData({ ...formData, deliveryPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.04 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Vendor Account"}
          </motion.button>
        </form>

        <div className="text-center mt-4 text-white/80 text-sm">
          Already have a vendor account?{" "}
          <Link
            to="/login/vendor"
            className="text-white font-semibold underline"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSignUp;
