import { Link, useParams } from "react-router-dom";

const AuthChooseAction = () => {
  const { role } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome {role === "customer" ? "Customer" : "Vendor"} 👋</h1>
        <p className="text-gray-500 mb-8">Log in or create account</p>

        <div className="flex flex-col gap-4">
          <Link
            to={`/login/${role}`}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>

          <Link
            to={`/signup/${role}`}
            className="border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          ← <Link to="/auth/role" className="text-orange-600 font-medium">Back</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthChooseAction;
