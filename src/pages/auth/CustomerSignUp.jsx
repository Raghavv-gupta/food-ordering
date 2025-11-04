import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Home } from "lucide-react";

const CustomerSignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-400 to-red-600 p-4">
      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .4 }}
        className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl p-8 rounded-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: .5, repeat: Infinity, repeatType: "reverse" }}
            className="bg-white/30 p-3 rounded-full"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white">Create Account ✨</h2>
          <p className="text-white/80 text-sm">Join us & enjoy delicious meals</p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <Home className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Address"
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-white/70 h-5 w-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/20 text-white placeholder-white/70 py-3 pl-11 pr-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: .95 }}
            whileHover={{ scale: 1.04 }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Create Account
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-white/80 text-sm">
          Already have an account?{" "}
          <Link to="/login/customer" className="text-white font-semibold underline">
            Login
          </Link>
        </div>

        <div className="mt-4 text-center text-white text-xs opacity-70">
          Customer Sign Up
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerSignUp;
