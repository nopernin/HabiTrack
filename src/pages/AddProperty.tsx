
import React, { useState } from 'react';
import PageTransition from '@/components/ui/PageTransition';
import PropertyForm from '@/components/PropertyForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/utils/types';
import MainLayout from '@/components/layout/MainLayout';
import { addProperty, mapPropertyToFirestoreProperty } from '@/services/property.service';
import { useAuth } from '@/context/AuthContext';
import { uploadPropertyImage } from '@/services/storage.service';

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (property: Partial<Property>, imageFile?: File) => {
    if (!userData?.uid) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un bien",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Handle image upload if provided
      let imageUrl = property.imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80';
      
      if (imageFile) {
        imageUrl = await uploadPropertyImage(imageFile, userData.uid, 'temp-id');
      }
      
      // Prepare property data with image URL
      const propertyWithImage = {
        ...property,
        imageUrl
      } as Property;
      
      // Map to Firestore format and add to database
      const firestoreProperty = mapPropertyToFirestoreProperty(propertyWithImage, userData.uid);
      await addProperty(firestoreProperty);
      
      toast({
        title: "Bien ajouté avec succès",
        description: `${property.name} a été ajouté à votre portefeuille.`,
      });

      // Redirect to properties page
      navigate('/properties');
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du bien.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default AddProperty;
