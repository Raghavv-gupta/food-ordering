import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🍔</span>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FoodHub
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/auth/role">
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
