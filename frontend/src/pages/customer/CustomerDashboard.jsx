import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarCustomer from '@/components/Customer/SidebarCustomer';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarCustomer 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar - Always visible */}
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🍔</span>
                <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
                  FoodHub
                </span>
              </Link>
            </div>

            {/* Right: Cart and Profile */}
            <div className="flex items-center space-x-2">
              <Link to="/customer/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              <Link to="/customer/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
