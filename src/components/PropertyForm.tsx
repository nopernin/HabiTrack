
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property, PropertyStatus, PropertyType } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Upload, Image } from 'lucide-react';

interface PropertyFormProps {
  onSubmit: (property: Partial<Property>, imageFile?: File) => void;
  property?: Property;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSubmit, 
  property,
  onCancel,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrer les statuts pour enlever "À VENDRE"
  const filteredStatuses = Object.values(PropertyStatus).filter(status => 
    status !== PropertyStatus.FOR_SALE
  );

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.imageUrl || null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
    
    onSubmit(formData, imageFile || undefined);
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
        {/* Image Upload Section */}
        <div className="mb-6">
          <Label className="mb-2 block">Image du bien</Label>
          <div 
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
          >
            {imagePreview ? (
              <div className="relative w-full">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="mx-auto max-h-64 rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <p className="text-white flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Changer l'image
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center">
                <Image className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Cliquez pour ajouter une image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        
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
              {filteredStatuses.map((status) => (
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
      </div>
      
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? "Enregistrement en cours..." 
            : property ? 'Mettre à jour' : 'Ajouter le bien'
          }
        </Button>
      </div>
    </motion.form>
  );
};

export default PropertyForm;
