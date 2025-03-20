
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  CreditCard, 
  Wrench, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import EventCalendar from '@/components/dashboard/EventCalendar';
import { useAuth } from '@/context/AuthContext';

const TenantDashboard = () => {
  const { userData } = useAuth();

  return (
    <div className="page-container pb-16">
      <div className="mb-6">
        <h1 className="page-title">Bienvenue, {userData?.prenom}</h1>
        <p className="text-muted-foreground">Gérez votre location et vos documents</p>
      </div>

      {/* Property Info Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative h-40 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8" 
            alt="Property" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h2 className="text-xl font-semibold">Votre logement</h2>
            <p className="text-sm opacity-90">Informations et documents</p>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Adresse</h3>
              <p>123 Rue des Lilas, 75001 Paris</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Loyer mensuel</h3>
              <p className="font-semibold">800 €</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Date du prochain paiement</h3>
              <p>01/11/2023</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fin du bail</h3>
              <p>31/08/2024</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/mon-logement">
              Voir les détails complets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard 
          title="Statut du loyer" 
          value="Payé" 
          description="Pour le mois en cours" 
          icon={CheckCircle} 
        />
        <StatCard 
          title="Prochaine échéance" 
          value="01/11/2023" 
          description="Date du prochain paiement" 
          icon={Calendar} 
        />
        <StatCard 
          title="Documents" 
          value="8" 
          description="Documents disponibles" 
          icon={FileText} 
        />
      </div>

      {/* Main Content Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Event Calendar */}
        <div className="lg:col-span-2">
          <EventCalendar />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Actions rapides</CardTitle>
            <CardDescription>Accédez aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/documents">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span>Documents</span>
                  <span className="text-xs text-muted-foreground">Quittances et contrat</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/paiements">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span>Paiements</span>
                  <span className="text-xs text-muted-foreground">Historique et prochain loyer</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/maintenance">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Wrench className="mr-2 h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span>Maintenance</span>
                  <span className="text-xs text-muted-foreground">Signaler un problème</span>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Departure Card */}
      <Card className="border-dashed border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base font-medium">Quitter mon logement</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Si vous souhaitez quitter votre logement, veuillez utiliser cette option.
            Cela entraînera la suppression de votre compte locataire et la libération du bien.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full">
            Initialiser mon départ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TenantDashboard;
