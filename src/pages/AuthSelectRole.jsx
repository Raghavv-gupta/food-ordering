import { Link, useNavigate } from "react-router-dom";
import { User, ChefHat } from "lucide-react";
import { useState } from "react";

const AuthSelectRole = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTimeout(() => {
      navigate(`/auth/${selectedRole}`);
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Who are you?</h1>
        <p className="text-gray-500 mb-8">Choose your account type</p>

        <div className="space-y-5">
          <button
            onClick={() => handleSelect("customer")}
            className="group w-full border rounded-xl p-5 flex items-center gap-4 hover:bg-orange-50 transition"
          >
            <User className="h-7 w-7 text-orange-500 group-hover:scale-110 transition" />
            <div className="text-left">
              <h2 className="text-lg font-semibold">Customer</h2>
              <p className="text-sm text-gray-500">Order delicious food</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("vendor")}
            className="group w-full border rounded-xl p-5 flex items-center gap-4 hover:bg-red-50 transition"
          >
            <ChefHat className="h-7 w-7 text-red-500 group-hover:scale-110 transition" />
            <div className="text-left">
              <h2 className="text-lg font-semibold">Vendor</h2>
              <p className="text-sm text-gray-500">Sell food & grow business</p>
            </div>
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-orange-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthSelectRole;
