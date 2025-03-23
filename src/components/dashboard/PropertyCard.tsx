import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Building2, Users, Euro } from 'lucide-react';
import { Bien } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


interface PropertyCardProps {
  property: Bien;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true); // Ouvre le dialogue
  };
  return (
    <>
      <div onClick={handleCardClick} className="block cursor-pointer">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            <img
              src={property.imageURL || '/placeholder-property.jpg'}
              alt={property.nom}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                property.statut === 'occupé' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {property.statut}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{property.nom}</h3>
            <p className="text-sm text-gray-600 mb-2">{property.type}</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{property.surface} m² • {property.nombre_pieces} pièces</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Euro className="w-4 h-4 mr-2" />
                <span>{property.loyer_mensuel}€ / mois</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{property.ville}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialogue pour afficher les détails de la propriété */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{property.nom}</DialogTitle>
            <DialogDescription>
              <img src={property.imageURL || '/placeholder-property.jpg'} alt={property.nom} className="w-full h-auto mb-2" />
              <p><strong>Type :</strong> {property.type}</p>
              <p><strong>Surface :</strong> {property.surface} m²</p>
              <p><strong>Nombre de pièces :</strong> {property.nombre_pieces}</p>
              <p><strong>Loyer mensuel :</strong> {property.loyer_mensuel}€</p>
              <p><strong>Statut :</strong> {property.statut}</p>
              <p><strong>Ville :</strong> {property.ville}</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
