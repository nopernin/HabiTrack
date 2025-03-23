import React, { useState, useEffect } from 'react';
import { Home, Calendar, Euro, Building, MapPin, Ruler, Users, FileText } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { getCurrentUser, getBien } from '@/services/firebaseServices';
import { Bien } from '@/types/types';

const MaLocation = () => {
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBien();
  }, []);

  const loadBien = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'locataire') {
        throw new Error('Vous devez être locataire pour accéder à cette page');
      }

      const bienData = await getBien(user.bienId);
      if (bienData) {
        setBien(bienData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bien) return <div>Bien non trouvé</div>;

  // Calculer les jours restants dans le bail
  const aujourdhui = new Date();
  const finBail = new Date(bien.fin_bail);
  const joursRestants = Math.ceil((finBail.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="page-title">Ma Location</h1>
            <p className="text-muted-foreground">Informations sur votre bien immobilier</p>
          </div>

          {/* En-tête avec statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Type de bien</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bien.type}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Surface</CardTitle>
                <Ruler className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bien.surface} m²</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyer mensuel</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bien.loyer_mensuel}€</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jours restants</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{joursRestants}</div>
              </CardContent>
            </Card>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Détails de votre bien immobilier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Nom:</span> {bien.nom}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Adresse:</span> {bien.adresse}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Ville:</span> {bien.ville}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Code postal:</span> {bien.code_postal}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Pays:</span> {bien.pays}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
                <CardDescription>Spécifications techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Surface:</span> {bien.surface} m²
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Nombre de pièces:</span> {bien.nombre_pieces}
                  </div>
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Loyer mensuel:</span> {bien.loyer_mensuel}€
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Début du bail:</span> {format(new Date(bien.debut_bail), 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Fin du bail:</span> {format(new Date(bien.fin_bail), 'dd/MM/yyyy')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Détails supplémentaires sur votre bien</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{bien.description}</p>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Voir les documents
            </Button>
            <Button className="w-full" variant="outline">
              <Euro className="mr-2 h-4 w-4" />
              Payer le loyer
            </Button>
            <Button className="w-full" variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Demander une intervention
            </Button>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default MaLocation; 