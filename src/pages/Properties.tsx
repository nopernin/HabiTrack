import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, SlidersHorizontal, Building, Trash2 } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProperties, getTenantsByPropertyId } from '@/utils/mockData';
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
import { getBiensProprietaire, supprimerBien, getCurrentUser, ajouterBien } from '../services/firebaseServices';
import { Bien } from '../types/types';
import PropertyForm from '@/components/PropertyForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Properties = () => {
  const { toast } = useToast();
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [bienToDelete, setBienToDelete] = useState<Bien | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBiens();
  }, []);

  const loadBiens = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'proprietaire') {
        throw new Error('Vous devez être propriétaire pour accéder à cette page');
      }
      const biensData = await getBiensProprietaire(user.uid);
      setBiens(biensData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bienToDelete) return;
    
    try {
      await supprimerBien(bienToDelete.id);
      setBienToDelete(null);
      loadBiens();
      toast({
        title: "Bien supprimé",
        description: "Le bien a été supprimé avec succès.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddBien = async (property: Partial<Property>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const newBien: Omit<Bien, 'id'> = {
        nom: property.name || '',
        type: property.type || '',
        adresse: property.address || '',
        ville: property.city || '',
        code_postal: property.postalCode || '',
        pays: property.country || 'France',
        nombre_pieces: property.rooms || 0,
        surface: property.area || 0,
        loyer_mensuel: property.rent || 0,
        statut: 'vacant',
        description: property.description || '',
        imageURL: property.imageUrl || '',
        proprietaireID: user.uid
      };

      await ajouterBien(newBien);
      setShowAddForm(false);
      loadBiens();
      toast({
        title: "Bien ajouté",
        description: "Le bien a été ajouté avec succès.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredBiens = biens.filter(bien => {
    const matchesSearch = 
      bien.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bien.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bien.ville.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || bien.statut === statusFilter;
    const matchesType = typeFilter === 'all' || bien.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un bien
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher un bien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupé">Occupé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Appartement">Appartement</SelectItem>
                      <SelectItem value="Maison">Maison</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Loft">Loft</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Triplex">Triplex</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Local commercial">Local commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Liste des biens */}
          <div className="space-y-6">
            {filteredBiens.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBiens.map((bien) => (
                  <div key={bien.id} className="relative group">
                    <PropertyCard property={bien} />
                    {bien.statut === 'vacant' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setBienToDelete(bien)}
                      >
                        Supprimer
                      </Button>
                    )}
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
                <Button onClick={() => setShowAddForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un bien
                </Button>
              </div>
            )}
          </div>

          {/* Dialog de confirmation de suppression */}
          <Dialog open={!!bienToDelete} onOpenChange={() => setBienToDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBienToDelete(null)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Formulaire d'ajout de bien */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau bien</DialogTitle>
                <DialogDescription>
                  Complétez le formulaire pour ajouter un nouveau bien à votre portefeuille
                </DialogDescription>
              </DialogHeader>
              <PropertyForm 
                onSubmit={handleAddBien}
                onCancel={() => setShowAddForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Properties;
