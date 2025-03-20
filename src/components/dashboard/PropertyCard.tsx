
import React from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertyStatus } from '@/utils/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, className }) => {
  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.OCCUPIED:
        return 'bg-green-100 text-green-800';
      case PropertyStatus.VACANT:
        return 'bg-blue-100 text-blue-800';
      case PropertyStatus.UNDER_MAINTENANCE:
        return 'bg-orange-100 text-orange-800';
      case PropertyStatus.FOR_SALE:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className={cn(
        "glass-card rounded-xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img 
          src={property.imageUrl} 
          alt={property.name} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <h3 className="text-white font-semibold text-lg">{property.name}</h3>
          <p className="text-white/90 text-sm">{property.city}, {property.postalCode}</p>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
            getStatusColor(property.status)
          )}>
            {property.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">{property.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Surface</p>
              <p className="font-medium">{property.area} m²</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pièces</p>
              <p className="font-medium">{property.rooms}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Loyer</p>
              <p className="font-medium">{property.rent} €/mois</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <Link 
              to={`/properties/${property.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir les détails
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
