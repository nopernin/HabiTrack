
import React from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import PropertyForm from '@/components/PropertyForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (property: Partial<Property>) => {
    // Dans une application réelle, cette fonction enverrait les données à une API
    // Ici, nous simulons simplement le succès et redirigeons vers la liste des biens
    console.log('Nouveau bien ajouté:', property);
    
    toast({
      title: "Bien ajouté avec succès",
      description: `${property.name} a été ajouté à votre portefeuille.`,
    });

    // Redirection vers la page des biens
    navigate('/properties');
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
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
        </main>
      </PageTransition>
    </>
  );
};

export default AddProperty;
