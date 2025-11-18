import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarVendor from '@/components/Vendor/SidebarVendor';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';

const VendorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarVendor 
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
              <Link to="/vendor/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl">🍔</span>
                <span className="text-xl font-display font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hidden sm:inline">
                  FoodHub Vendor
                </span>
              </Link>
            </div>

            {/* Right: Profile */}
            <div className="flex items-center space-x-2">
              <Link to="/vendor/restaurant">
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

export default VendorDashboard;
