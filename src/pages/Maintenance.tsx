
import React, { useState } from 'react';
import { Wrench, Filter, Search, Clock, PlusCircle, AlertTriangle, CheckCircle, MoreVertical, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { 
  mockMaintenanceRequests, 
  mockProperties,
  getPropertyById
} from '@/utils/mockData';
import { MaintenancePriority, MaintenanceStatus } from '@/utils/types';
import { motion } from 'framer-motion';

const Maintenance = () => {
  const [maintenanceRequests] = useState(mockMaintenanceRequests);
  const [activeTab, setActiveTab] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Get priority color class
  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case MaintenancePriority.LOW:
        return 'bg-blue-100 text-blue-800';
      case MaintenancePriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case MaintenancePriority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case MaintenancePriority.EMERGENCY:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color class
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case MaintenanceStatus.SCHEDULED:
        return 'bg-purple-100 text-purple-800';
      case MaintenanceStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case MaintenanceStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case MaintenanceStatus.CANCELED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter maintenance requests
  const filteredRequests = maintenanceRequests.filter(request => {
    // Filter by tab (status)
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pending' && (
        request.status === MaintenanceStatus.PENDING || 
        request.status === MaintenanceStatus.SCHEDULED
      )) ||
      (activeTab === 'in-progress' && request.status === MaintenanceStatus.IN_PROGRESS) ||
      (activeTab === 'completed' && (
        request.status === MaintenanceStatus.COMPLETED || 
        request.status === MaintenanceStatus.CANCELED
      ));
    
    // Filter by property
    const matchesProperty = propertyFilter === 'all' || request.propertyId === propertyFilter;
    
    // Filter by priority
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    // Filter by search query
    const matchesSearch = 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesProperty && matchesPriority && matchesSearch;
  });

  const openRequestDetails = (request: any) => {
    setSelectedRequest(request);
  };

  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Maintenance</h1>
              <p className="text-muted-foreground">Gérez les demandes d'intervention et les travaux</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle demande
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Rechercher une demande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto w-full justify-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>

            {showFilters && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 bg-muted/10 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">Bien immobilier</label>
                  <Select 
                    value={propertyFilter} 
                    onValueChange={setPropertyFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les biens</SelectItem>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priorité</label>
                  <Select 
                    value={priorityFilter} 
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les priorités</SelectItem>
                      {Object.values(MaintenancePriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Maintenance requests list */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="in-progress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              {filteredRequests.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRequests.map((request) => {
                    const property = getPropertyById(request.propertyId);
                    return (
                      <Card key={request.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                    {request.priority}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                    {request.status}
                                  </span>
                                </div>
                                <h3 className="font-medium text-lg line-clamp-1">{request.title}</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {property?.name || 'Bien non spécifié'}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openRequestDetails(request)}>
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Modifier le statut</DropdownMenuItem>
                                  <DropdownMenuItem>Assigner</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm mt-3 line-clamp-2">
                              {request.description}
                            </p>
                            <div className="flex items-center mt-4 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(request.date)}</span>
                              {request.assignedTo && (
                                <span className="ml-3">• Assigné à: {request.assignedTo}</span>
                              )}
                            </div>
                          </div>
                          
                          {request.images && request.images.length > 0 && (
                            <div 
                              className="h-48 bg-cover bg-center border-t mt-2" 
                              style={{ backgroundImage: `url(${request.images[0]})` }}
                              onClick={() => openRequestDetails(request)}
                            />
                          )}
                          
                          <div className="p-3 border-t flex justify-between items-center">
                            <span className="text-sm">
                              {request.estimatedCost 
                                ? `Coût estimé: ${request.estimatedCost} €` 
                                : "Aucun coût estimé"}
                            </span>
                            <Button size="sm" onClick={() => openRequestDetails(request)}>
                              Détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Aucune demande trouvée</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Créez une nouvelle demande ou modifiez vos filtres.
                  </p>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle demande
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Maintenance request details dialog */}
          {selectedRequest && (
            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedRequest.title}</DialogTitle>
                  <DialogDescription>
                    Demande de maintenance pour {getPropertyById(selectedRequest.propertyId)?.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(selectedRequest.date)}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm">{selectedRequest.description}</p>
                  </div>
                  
                  {selectedRequest.assignedTo && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assigné à</h4>
                      <p className="text-sm">{selectedRequest.assignedTo}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Coût estimé</h4>
                      <p className="text-sm">{selectedRequest.estimatedCost ? `${selectedRequest.estimatedCost} €` : "Non spécifié"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Coût réel</h4>
                      <p className="text-sm">{selectedRequest.actualCost ? `${selectedRequest.actualCost} €` : "Non spécifié"}</p>
                    </div>
                  </div>
                  
                  {selectedRequest.images && selectedRequest.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRequest.images.map((image: string, index: number) => (
                          <img 
                            key={index} 
                            src={image} 
                            alt={`Image ${index + 1}`} 
                            className="w-full h-40 object-cover rounded-md" 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedRequest.status !== MaintenanceStatus.COMPLETED && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Commentaire</h4>
                      <Textarea placeholder="Ajouter un commentaire..." />
                    </div>
                  )}
                </div>
                
                <DialogFooter className="gap-2 sm:gap-0">
                  {selectedRequest.status === MaintenanceStatus.PENDING && (
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Planifier
                    </Button>
                  )}
                  
                  {(selectedRequest.status === MaintenanceStatus.PENDING || 
                    selectedRequest.status === MaintenanceStatus.SCHEDULED) && (
                    <Button variant="default" className="w-full sm:w-auto">
                      En cours
                    </Button>
                  )}
                  
                  {selectedRequest.status === MaintenanceStatus.IN_PROGRESS && (
                    <Button variant="default" className="w-full sm:w-auto">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer comme terminé
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </PageTransition>
    </>
  );
};

export default Maintenance;
