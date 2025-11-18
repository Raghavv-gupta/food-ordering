import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import FrontPage from "./pages/FrontPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import AuthSelectRole from "./pages/AuthSelectRole";
import AuthChooseAction from "./pages/AuthChooseAction";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerSignUp from "./pages/auth/CustomerSignUp";
import VendorLogin from "./pages/auth/VendorLogin";
import VendorSignUp from "./pages/auth/VendorSignUp";
import AllVendors from "./pages/customer/AllVendors";
import VendorMenu from "./pages/customer/VendorMenu";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyProfile from "./pages/customer/MyProfile";
import ManageAddresses from "./pages/customer/ManageAddresses";
import MyOrders from "./pages/customer/MyOrders";
import Favorites from "./pages/customer/Favorites";
import MyWallet from "./pages/customer/MyWallet";
import OffersRewards from "./pages/customer/OffersRewards";
import Notifications from "./pages/customer/Notifications";
import HelpSupport from "./pages/customer/HelpSupport";
import Settings from "./pages/customer/Settings";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import Dashboard from "./pages/vendor/Dashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import MenuItems from "./pages/vendor/MenuItems";
import RestaurantProfile from "./pages/vendor/RestaurantProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<FrontPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/menu/:category" element={<CategoryPage />} />
              <Route path="/menu/cart" element={<CartPage />} />
              <Route path="/checkout-success" element={<CheckoutPage />} />
              <Route path="*" element={<NotFound />} />

              <Route path="/auth/role" element={<AuthSelectRole />} />
              <Route path="/auth/:role" element={<AuthChooseAction />} />
              <Route path="/login/customer" element={<CustomerLogin />} />
              <Route path="/signup/customer" element={<CustomerSignUp />} />
              <Route path="/login/vendor" element={<VendorLogin />} />
              <Route path="/signup/vendor" element={<VendorSignUp />} />

              {/* Customer Dashboard Routes */}
              <Route path="/customer" element={<CustomerDashboard />}>
                <Route index element={<AllVendors />} />
                <Route path="vendors" element={<AllVendors />} />
                <Route path="vendor/:vendorId" element={<VendorMenu />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="addresses" element={<ManageAddresses />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="wallet" element={<MyWallet />} />
                <Route path="offers" element={<OffersRewards />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reviews" element={<MyOrders />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpSupport />} />
              </Route>

              {/* Vendor Dashboard Routes */}
              <Route path="/vendor" element={<VendorDashboard />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="menu" element={<MenuItems />} />
                <Route path="restaurant" element={<RestaurantProfile />} />
                <Route path="earnings" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
