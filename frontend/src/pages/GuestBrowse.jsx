import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const GuestBrowse = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FoodHub
            </span>
          </Link>

          {/* Right: Cart and Login */}
          <div className="flex items-center space-x-2">
            <Link to="/browse/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/auth/role">
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestBrowse;
