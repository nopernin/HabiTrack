import React from 'react';
import PageTransition from '@/components/ui/PageTransition';
import PropertyForm from '@/components/PropertyForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/utils/types';
import MainLayout from '@/components/layout/MainLayout';
import { getCurrentUser, ajouterBien } from '@/services/firebaseServices';
import { Bien } from '@/types/types';

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (property: Partial<Property>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const newBien: Omit<Bien, 'id'> = {
        nom: property.name || '',
        type: property.type || '',
        adresse: property.address || '',
        ville: property.city || '',
        code_postal: property.postalCode || '',
        pays: property.country || 'France',
        nombre_pieces: property.rooms || 0,
        surface: property.area || 0,
        loyer_mensuel: property.rent || 0,
        statut: 'vacant',
        description: property.description || '',
        imageURL: property.imageUrl || '',
        proprietaireID: user.uid,
        locataireId: null
      };

      await ajouterBien(newBien);
      
      toast({
        title: "Bien ajouté avec succès",
        description: `${property.name} a été ajouté à votre portefeuille.`,
      });

      navigate('/properties');
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container pb-16">
          <div className="mb-8">
            <h1 className="page-title">Ajouter un bien</h1>
            <p className="text-muted-foreground">Complétez le formulaire pour ajouter un nouveau bien à votre portefeuille</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <PropertyForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default AddProperty;
