
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property, PropertyStatus, PropertyType } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface PropertyFormProps {
  onSubmit: (property: Partial<Property>) => void;
  property?: Property;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSubmit, 
  property,
  onCancel
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Property>>(
    property || {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      type: PropertyType.APARTMENT,
      rooms: 1,
      area: 0,
      rent: 0,
      status: PropertyStatus.VACANT,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setFormData({
      ...formData,
      [name]: numValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.address || !formData.city) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du bien<span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Appartement Centre-Ville"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type de bien<span className="text-destructive">*</span></Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PropertyType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse<span className="text-destructive">*</span></Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="15 rue de la République"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville<span className="text-destructive">*</span></Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Lyon"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal<span className="text-destructive">*</span></Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="69001"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="France"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rooms">Nombre de pièces</Label>
            <Input
              id="rooms"
              name="rooms"
              type="number"
              min="0"
              value={formData.rooms}
              onChange={(e) => handleNumberChange('rooms', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Surface (m²)</Label>
            <Input
              id="area"
              name="area"
              type="number"
              min="0"
              value={formData.area}
              onChange={(e) => handleNumberChange('area', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rent">Loyer mensuel (€)</Label>
            <Input
              id="rent"
              name="rent"
              type="number"
              min="0"
              value={formData.rent}
              onChange={(e) => handleNumberChange('rent', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PropertyStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description du bien..."
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de l'image</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit">
          {property ? 'Mettre à jour' : 'Ajouter le bien'}
        </Button>
      </div>
    </motion.form>
  );
};

export default PropertyForm;
