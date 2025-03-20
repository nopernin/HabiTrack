
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, SlidersHorizontal, Building, Trash2 } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property, PropertyStatus, PropertyType } from '@/utils/types';
import MainLayout from '@/components/layout/MainLayout';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner, deleteProperty, mapFirestorePropertyToProperty } from '@/services/property.service';

const Properties = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      if (!userData?.uid) return;
      
      try {
        setIsLoading(true);
        const firestoreProperties = await getPropertiesByOwner(userData.uid);
        const mappedProperties = firestoreProperties.map(mapFirestorePropertyToProperty);
        setProperties(mappedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos biens immobiliers",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [userData, toast]);

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await deleteProperty(propertyToDelete.id);
        
        // Update local state
        const updatedProperties = properties.filter(p => p.id !== propertyToDelete.id);
        setProperties(updatedProperties);
        
        toast({
          title: "Bien supprimé",
          description: `${propertyToDelete.name} a été supprimé avec succès.`,
        });
        
      } catch (error) {
        console.error("Error deleting property:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du bien.",
          variant: "destructive"
        });
      } finally {
        setPropertyToDelete(null);
      }
    }
  };

  const filteredProperties = properties.filter(property => {
    // Search query filter
    const matchesSearch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Status filter
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Mes biens immobiliers</h1>
              <p className="text-muted-foreground">Gérez votre portefeuille immobilier</p>
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

          {/* Search and filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Rechercher un bien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto w-full justify-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
                <SlidersHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 bg-muted/10 p-4 rounded-lg animate-slide-in-up">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {Object.values(PropertyStatus).filter(status => status !== PropertyStatus.FOR_SALE).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de bien</label>
                  <Select 
                    value={typeFilter} 
                    onValueChange={setTypeFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.values(PropertyType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Properties grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => handleDeleteProperty(property)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun bien trouvé</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez votre premier bien ou modifiez vos filtres.
              </p>
              <Button asChild className="mt-4">
                <Link to="/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un bien
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce bien ?</AlertDialogTitle>
              <AlertDialogDescription>
                {propertyToDelete && (
                  <>
                    Vous êtes sur le point de supprimer "{propertyToDelete.name}". 
                    Cette action est irréversible et supprimera toutes les données associées à ce bien.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageTransition>
    </MainLayout>
  );
};

export default Properties;
