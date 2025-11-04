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
import NotFound from "./pages/NotFound";
import AuthSelectRole from "./pages/AuthSelectRole";
import AuthChooseAction from "./pages/AuthChooseAction";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerSignUp from "./pages/auth/CustomerSignUp";
import VendorLogin from "./pages/auth/VendorLogin";
import VendorSignUp from "./pages/auth/VendorSignUp";

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
              <Route path="*" element={<NotFound />} />

              <Route path="/auth/role" element={<AuthSelectRole />} />
              <Route path="/auth/:role" element={<AuthChooseAction />} />
              <Route path="/login/customer" element={<CustomerLogin />} />
              <Route path="/signup/customer" element={<CustomerSignUp />} />
              <Route path="/login/vendor" element={<VendorLogin />} />
              <Route path="/signup/vendor" element={<VendorSignUp />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
