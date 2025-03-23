import React, { useState, useEffect } from 'react';
import { Wrench, AlertCircle, Clock, CheckCircle, XCircle, Plus, Search } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { getCurrentUser } from '@/services/firebaseServices';
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '@/types/types';

const Maintenance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: MaintenancePriority.MEDIUM,
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'locataire') {
        throw new Error('Vous devez être locataire pour accéder à cette page');
      }

      // TODO: Implémenter la récupération des demandes de maintenance depuis Firestore
      // Pour l'instant, on utilise des données mockées
      const mockRequests: MaintenanceRequest[] = [
        {
          id: '1',
          propertyId: user.bienId,
          tenantId: user.uid,
          title: 'Fuite dans la salle de bain',
          description: 'Il y a une fuite sous le lavabo',
          date: new Date(),
          status: MaintenanceStatus.PENDING,
          priority: MaintenancePriority.HIGH,
        },
        {
          id: '2',
          propertyId: user.bienId,
          tenantId: user.uid,
          title: 'Climatisation en panne',
          description: 'La climatisation ne fonctionne plus',
          date: new Date(),
          status: MaintenanceStatus.IN_PROGRESS,
          priority: MaintenancePriority.MEDIUM,
        },
      ];

      setRequests(mockRequests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    try {
      // TODO: Implémenter l'envoi de la demande à Firestore
      console.log('Nouvelle demande:', newRequest);
      setShowNewRequestForm(false);
      setNewRequest({ title: '', description: '', priority: MaintenancePriority.MEDIUM });
      loadRequests();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return 'text-yellow-500';
      case MaintenanceStatus.IN_PROGRESS:
        return 'text-blue-500';
      case MaintenanceStatus.COMPLETED:
        return 'text-green-500';
      case MaintenanceStatus.CANCELED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case MaintenancePriority.HIGH:
        return 'text-red-500';
      case MaintenancePriority.MEDIUM:
        return 'text-yellow-500';
      case MaintenancePriority.LOW:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Maintenance</h1>
              <p className="text-muted-foreground">Gestion des demandes d'intervention</p>
            </div>
            <Button onClick={() => setShowNewRequestForm(true)} className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une demande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={MaintenanceStatus.PENDING}>En attente</SelectItem>
                <SelectItem value={MaintenanceStatus.IN_PROGRESS}>En cours</SelectItem>
                <SelectItem value={MaintenanceStatus.COMPLETED}>Terminée</SelectItem>
                <SelectItem value={MaintenanceStatus.CANCELED}>Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value={MaintenancePriority.HIGH}>Haute</SelectItem>
                <SelectItem value={MaintenancePriority.MEDIUM}>Moyenne</SelectItem>
                <SelectItem value={MaintenancePriority.LOW}>Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Formulaire de nouvelle demande */}
          {showNewRequestForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nouvelle demande d'intervention</CardTitle>
                <CardDescription>Décrivez le problème que vous rencontrez</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Titre</label>
                    <Input
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      placeholder="Ex: Fuite dans la salle de bain"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      placeholder="Décrivez le problème en détail..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priorité</label>
                    <Select
                      value={newRequest.priority}
                      onValueChange={(value) => setNewRequest({ ...newRequest, priority: value as MaintenancePriority })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MaintenancePriority.HIGH}>Haute</SelectItem>
                        <SelectItem value={MaintenancePriority.MEDIUM}>Moyenne</SelectItem>
                        <SelectItem value={MaintenancePriority.LOW}>Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmitRequest}>
                      Envoyer la demande
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des demandes */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>{request.description}</TableCell>
                        <TableCell>{format(new Date(request.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center ${getStatusColor(request.status)}`}>
                            {request.status === MaintenanceStatus.PENDING && <Clock className="h-4 w-4 mr-1" />}
                            {request.status === MaintenanceStatus.IN_PROGRESS && <Wrench className="h-4 w-4 mr-1" />}
                            {request.status === MaintenanceStatus.COMPLETED && <CheckCircle className="h-4 w-4 mr-1" />}
                            {request.status === MaintenanceStatus.CANCELED && <XCircle className="h-4 w-4 mr-1" />}
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center ${getPriorityColor(request.priority)}`}>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {request.priority}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Aucune demande trouvée</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Modifiez vos filtres ou créez une nouvelle demande.
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

export default Maintenance; 