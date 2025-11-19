import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  ChevronRight,
  Heart,
  Wallet,
  Bell,
  Star,
  Settings,
  HelpCircle,
  Gift,
  Menu,
  X,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const SidebarCustomer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Get customer info from localStorage
  const getCustomerData = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const customer = getCustomerData();
  const customerName = customer?.name || 'Guest User';
  const customerEmail = customer?.email || 'guest@example.com';

  const menuItems = [
    {
      section: 'Browse',
      items: [
        {
          id: 'vendors',
          label: 'All Vendors',
          icon: Store,
          path: '/customer/vendors',
          description: 'Browse restaurants & order',
        },
      ]
    },
    {
      section: 'Account',
      items: [
        {
          id: 'profile',
          label: 'My Profile',
          icon: User,
          path: '/customer/profile',
          description: 'View and edit your profile',
        },
      ]
    },
    {
      section: 'Orders',
      items: [
        {
          id: 'orders',
          label: 'My Orders',
          icon: ShoppingBag,
          path: '/customer/orders',
          description: 'Track your orders',
        },
      ]
    }
  ];

  const preventBack = () => {
    window.history.pushState(null, '', '/');
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    console.log('Confirming logout...');
    
    // Close the dialog first
    setShowLogoutDialog(false);
    
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Clear session storage as well
    sessionStorage.clear();
    
    console.log('Auth data cleared');
    
    // Close any open modals
    if (onClose) onClose();
    
    // Navigate to landing page and replace history to prevent back navigation
    navigate('/', { replace: true });
    
    // Additional cleanup - clear browser history stack
    window.history.pushState(null, '', '/');
    
    // Prevent back navigation
    window.addEventListener('popstate', preventBack);
    
    console.log('Logged out successfully');
  };

  // Cleanup event listener on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-card border-r border-border z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-80 flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FoodHub
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{customerName}</p>
              <p className="text-sm text-muted-foreground truncate">{customerEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg 
                        transition-all duration-200 group
                        ${active 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                          : 'hover:bg-muted text-foreground'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${active ? 'text-white' : ''}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs ${active ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant={active ? "secondary" : "default"}
                          className="ml-auto"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-muted-foreground'}`} />
                    </Link>
                  );
                })}
              </div>
              {section.section !== 'Other' && <Separator className="mt-4" />}
            </div>
          ))}
        </nav>

        {/* Footer - Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setShowLogoutDialog(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-[10000] bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-2">Are you sure you want to logout?</h2>
            <p className="text-muted-foreground mb-6">
              You will need to login again to access your account.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarCustomer;
