
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">RR</span>
            </div>
            <span className="font-semibold text-xl">Renter Ranger</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="default" size="sm">
                Connexion
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm pt-16 animate-fade-in">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6 text-lg font-medium">
            <Link 
              to="/" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Tableau de bord
            </Link>
            <Link 
              to="/properties" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/properties" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Biens immobiliers
            </Link>
            <Link 
              to="/tenants" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/tenants" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Locataires
            </Link>
            <Link 
              to="/documents" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/documents" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Documents
            </Link>
            <Link 
              to="/finance" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/finance" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Finances
            </Link>
            <Link 
              to="/maintenance" 
              className={cn(
                "py-2 transition-colors hover:text-primary", 
                location.pathname === "/maintenance" ? "text-primary font-semibold" : ""
              )}
              onClick={closeMenu}
            >
              Maintenance
            </Link>
            <div className="pt-4 flex items-center">
              <Button className="w-full">Connexion</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
