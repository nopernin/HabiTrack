
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building, 
  FileText, 
  CreditCard, 
  Wrench, 
  Users,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  expanded: boolean;
};

const NavItem = ({ to, icon: Icon, label, expanded }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center py-3 px-3 my-1 rounded-lg transition-colors relative group",
        expanded ? "pl-4" : "justify-center",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded ? (
        <span className="ml-3 font-medium text-sm">{label}</span>
      ) : (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover rounded-md shadow-md text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { userRole } = useAuth();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '64px' }
  };

  const toggleButtonVariants = {
    expanded: { rotate: 180 },
    collapsed: { rotate: 0 }
  };

  // Common nav items for both roles
  const commonNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/finance', icon: CreditCard, label: 'Finances' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  ];

  // Proprietaire-specific nav items
  const proprietaireNavItems = [
    { to: '/properties', icon: Building, label: 'Biens immobiliers' },
    { to: '/tenants', icon: Users, label: 'Locataires' },
  ];

  // Locataire-specific nav items
  const locataireNavItems = [
    { to: '/mon-logement', icon: Home, label: 'Mon logement' },
  ];

  // Get the appropriate nav items based on user role
  const navItems = [
    ...commonNavItems,
    ...(userRole === 'proprietaire' ? proprietaireNavItems : []),
    ...(userRole === 'locataire' ? locataireNavItems : [])
  ];

  return (
    <motion.aside
      initial={expanded ? "expanded" : "collapsed"}
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen sticky top-16 left-0 z-30 bg-background border-r border-border overflow-hidden",
        expanded ? "w-60" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full pt-5 pb-4">
        <div className="flex-1 flex flex-col">
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
              />
            ))}
          </nav>
        </div>
        <div className="px-3 mt-auto">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent flex items-center justify-center w-full"
            aria-label={expanded ? "Réduire le menu" : "Agrandir le menu"}
          >
            <motion.div
              initial={expanded ? "expanded" : "collapsed"}
              animate={expanded ? "expanded" : "collapsed"}
              variants={toggleButtonVariants}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
