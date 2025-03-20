
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, FileText, CreditCard, Wrench, ArrowRight, Plus, DollarSign, UserRound, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import PropertyCard from '@/components/dashboard/PropertyCard';
import EventCalendar from '@/components/dashboard/EventCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  mockProperties, 
  mockTenants, 
  mockPayments, 
  mockMaintenanceRequests,
  getOccupancyRate, 
  getTotalIncome 
} from '@/utils/mockData';
import { PaymentStatus, MaintenanceStatus } from '@/utils/types';

const Index = () => {
  // Réduire le nombre de propriétés à 2 (au lieu de 3)
  const [properties] = useState(mockProperties.slice(0, 2));
  
  // Dashboard stats
  const totalProperties = properties.length;
  const totalTenants = mockTenants.length;
  const occupancyRate = getOccupancyRate();
  const totalIncome = getTotalIncome();
  
  const pendingPayments = mockPayments.filter(p => p.status === PaymentStatus.PENDING).length;
  const pendingMaintenance = mockMaintenanceRequests.filter(
    m => m.status === MaintenanceStatus.PENDING || m.status === MaintenanceStatus.SCHEDULED
  ).length;
  
  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="page-title">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue sur votre gestionnaire immobilier</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <Link to="/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un bien
                </Link>
              </Button>
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
                value={totalTenants} 
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
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/properties">
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  {properties.map((property) => (
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
                      {pendingPayments > 0 && (
                        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                          {pendingPayments}
                        </span>
                      )}
                    </Button>
                  </Link>
                  
                  <Link to="/maintenance">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Wrench className="mr-2 h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>Maintenance</span>
                        <span className="text-xs text-muted-foreground">Suivi des interventions</span>
                      </div>
                      {pendingMaintenance > 0 && (
                        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                          {pendingMaintenance}
                        </span>
                      )}
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
        </main>
      </PageTransition>
    </>
  );
};

export default Index;
