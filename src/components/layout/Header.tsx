
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Search, UserRound, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth.service';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, userData, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      });
    }
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
          {currentUser ? (
            <>
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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <UserRound className="h-4 w-4" />
                        {userData?.prenom}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                        Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="default" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && currentUser && (
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
            
            {userRole === 'proprietaire' && (
              <>
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
              </>
            )}
            
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
              <Button className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
