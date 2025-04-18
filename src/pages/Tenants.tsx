import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRound, Home, Mail, Phone, Calendar, Plus, Search, UserPlus } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { getBiensProprietaire, getCurrentUser, getLocatairesBien } from '@/services/firebaseServices';
import { Bien, Locataire } from '@/types/types';

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Bien[]>([]);
  const [tenants, setTenants] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPropertiesAndTenants();
  }, []);

  const loadPropertiesAndTenants = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'proprietaire') {
        throw new Error('Vous devez être propriétaire pour accéder à cette page');
      }

      // Charger les biens du propriétaire
      const biensData = await getBiensProprietaire(user.uid);
      setProperties(biensData);

      // Charger les locataires pour chaque bien occupé
      const tenantsPromises = biensData
        .filter(bien => bien.locataireId)
        .map(bien => getLocatairesBien(bien.id));

      const tenantsResults = await Promise.all(tenantsPromises);
      const allTenants = tenantsResults.flat();
      setTenants(allTenants);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les dates
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Filtrer les locataires en fonction de la recherche
  const filteredTenants = tenants
    .filter(tenant => 
      tenant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(tenant => {
      const property = properties.find(p => p.locataireId === tenant.id);
      return {
        id: tenant.id,
        firstName: tenant.nom.split(' ')[0],
        lastName: tenant.nom.split(' ').slice(1).join(' '),
        email: tenant.email,
        phone: tenant.telephone,
        propertyId: property?.id || '',
        leaseStart: property?.debut_bail || new Date(),
        leaseEnd: property?.fin_bail || new Date(),
        rentAmount: property?.loyer_mensuel || 0
      };
    });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Locataires</h1>
              <p className="text-muted-foreground">Gestion des locataires et des contrats de location</p>
            </div>
          </div>

          {/* Zone de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un locataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des locataires */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Bien occupé</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Début du bail</TableHead>
                    <TableHead>Fin du bail</TableHead>
                    <TableHead>Loyer mensuel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <UserRound className="h-5 w-5 text-primary" />
                            </div>
                            {tenant.firstName} {tenant.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                            {properties.find(p => p.locataireId === tenant.id)?.nom || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                              {tenant.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                              {tenant.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(tenant.leaseStart)}</TableCell>
                        <TableCell>{formatDate(tenant.leaseEnd)}</TableCell>
                        <TableCell className="font-medium">{tenant.rentAmount.toLocaleString()} €</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Aucun locataire trouvé</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Modifiez votre recherche ou ajoutez un nouveau locataire.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Tenants;
