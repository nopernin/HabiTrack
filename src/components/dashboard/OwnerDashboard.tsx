
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, FileText, CreditCard, Wrench, ArrowRight, Plus, DollarSign, UserRound, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PropertyCard from '@/components/dashboard/PropertyCard';
import EventCalendar from '@/components/dashboard/EventCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner } from '@/services/property.service';
import { getTenantsByOwner } from '@/services/tenant.service';
import { Property } from '@/utils/types';

const OwnerDashboard = () => {
  const { userData } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantCount, setTenantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.uid) return;
      
      try {
        setIsLoading(true);
        
        // Fetch properties
        const firestoreProperties = await getPropertiesByOwner(userData.uid);
        const mappedProperties = firestoreProperties.map(prop => ({
          id: prop.id,
          name: prop.nom,
          address: prop.adresse,
          city: prop.ville,
          postalCode: prop.codePostal,
          country: prop.pays,
          type: prop.type,
          rooms: prop.nombrePieces,
          area: prop.surface,
          rent: prop.loyerMensuel,
          imageUrl: prop.imageUrl,
          status: prop.statut,
          description: prop.description
        }));
        setProperties(mappedProperties);
        
        // Fetch tenants
        const tenants = await getTenantsByOwner(userData.uid);
        setTenantCount(tenants.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userData]);
  
  // Dashboard stats
  const totalProperties = properties.length;
  
  // Calculate occupancy rate
  const occupancyRate = properties.length > 0
    ? (properties.filter(p => p.status === 'Occupé').length / properties.length) * 100
    : 0;
  
  // Calculate total income (monthly rent sum)
  const totalIncome = properties.reduce((sum, property) => sum + property.rent, 0);
  
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Bienvenue sur votre tableau de bord</h1>
        <p className="text-muted-foreground">Gérez efficacement vos biens immobiliers</p>
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
            value={tenantCount} 
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
                Gérez vos propriétés
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/properties">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                {properties.slice(0, 2).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-medium">Aucun bien</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vous n'avez pas encore ajouté de biens immobiliers.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/properties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un bien
                  </Link>
                </Button>
              </div>
            )}
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
    </>
  );
};

export default OwnerDashboard;
