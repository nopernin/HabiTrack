import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, FileText, CreditCard, Wrench, ArrowRight, Plus, DollarSign, UserRound, AlertTriangle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import PropertyCard from '@/components/dashboard/PropertyCard';
import EventCalendar from '@/components/dashboard/EventCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentStatus, MaintenanceStatus } from '@/utils/types';
import MainLayout from '@/components/layout/MainLayout';
import { getBiensProprietaire, getCurrentUser } from '@/services/firebaseServices';
import { Bien } from '@/types/types';

const Index = () => {
  const [properties, setProperties] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proprietaireNom, setProprietaireNom] = useState('');
  
  useEffect(() => {
    loadBiens();
    loadProprietaire();
  }, []);

  const loadProprietaire = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setProprietaireNom(user.displayName || 'Propriétaire');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du propriétaire:', error);
      setProprietaireNom('Propriétaire');
    }
  };

  const loadBiens = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'proprietaire') {
        throw new Error('Vous devez être propriétaire pour accéder à cette page');
      }
      const biensData = await getBiensProprietaire(user.uid);
      setProperties(biensData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard stats
  const totalProperties = properties.length;
  const biensOccupes = properties.filter(bien => bien.statut === 'occupé').length;
  const occupancyRate = totalProperties > 0 ? (biensOccupes / totalProperties) * 100 : 0;
  const totalIncome = properties.reduce((acc, bien) => acc + bien.loyer_mensuel, 0);
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container pb-16">
          {/* Carte d'accueil avec image de fond */}
          <div className="relative rounded-xl overflow-hidden h-[400px] mb-8">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://img.freepik.com/free-photo/blue-armchair-against-blue-wall-living-room-interior-elegant-interior-design-with-copy-space-ai-generative_123827-23719.jpg?t=st=1742546794~exp=1742550394~hmac=a3f064ad376c0b10fc6280034088c373649354239f96a2ecb443046ef4871b35&w=1380)'
              }}
            />
            <div className="absolute top-[15%] left-[15%]">
              <h1 className="text-7xl font-bold text-white">Welcome</h1>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Link to="/properties" className="block w-full">
              <StatCard 
                title="Biens immobiliers" 
                value={totalProperties} 
                description="Nombre total de biens" 
                icon={Building} 
              />
            </Link>
            <Link to="/tenants" className="block w-full">
              <StatCard 
                title="Locataires" 
                value={biensOccupes} 
                description="Locataires actifs" 
                icon={UserRound} 
              />
            </Link>
            <StatCard 
              title="Taux d'occupation" 
              value={`${occupancyRate.toFixed(0)}%`} 
              description="Pourcentage de biens occupés" 
              icon={Home} 
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard 
              title="Revenus" 
              value={`${totalIncome.toLocaleString()} €`} 
              description="Revenus locatifs totaux" 
              icon={DollarSign} 
              trend={{ value: 3, isPositive: true }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Properties Section */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Mes biens</CardTitle>
                  <CardDescription>
                    Gérez vos propriétés (limite de 3 biens en version gratuite)
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/properties">
                      Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/add-property">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un bien
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  {properties.slice(0, 2).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Calendar */}
            <EventCalendar />

            {/* Quick Actions Card */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">Actions rapides</CardTitle>
                <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Link to="/documents">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>Documents</span>
                        <span className="text-xs text-muted-foreground">Gérer les contrats et documents</span>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link to="/finance">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>Finances</span>
                        <span className="text-xs text-muted-foreground">Suivi des paiements et revenus</span>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link to="/maintenance">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Wrench className="mr-2 h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>Maintenance</span>
                        <span className="text-xs text-muted-foreground">Suivi des interventions</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Free account notification */}
          <Card className="border-dashed border-muted bg-muted/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base font-medium">Compte gratuit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vous utilisez actuellement la version gratuite, limitée à 3 biens immobiliers.
                Passez à la version premium pour gérer un nombre illimité de propriétés et accéder
                à des fonctionnalités avancées.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Découvrir la version Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
