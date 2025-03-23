import React, { useState, useEffect } from 'react';
import { getLocatairesBien, supprimerLocataire, getBien } from '../../services/firebaseServices';
import { Locataire, Bien } from '../../types/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Calendar, Euro, AlertCircle } from "lucide-react";

interface DashboardLocataireProps {
  locataireId: string;
  bienId: string;
}

export const DashboardLocataire: React.FC<DashboardLocataireProps> = ({ locataireId, bienId }) => {
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadBien();
  }, [bienId]);

  const loadBien = async () => {
    try {
      const bienData = await getBien(bienId);
      if (bienData) {
        setBien(bienData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await supprimerLocataire(locataireId, bienId);
      // Rediriger vers la page de connexion ou gérer la déconnexion
    } catch (err: any) {
      setError(err.message);
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
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Type de bien</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bien.type}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surface</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
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

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Mon Bien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Informations générales</h3>
              <p><span className="font-medium">Nom:</span> {bien.nom}</p>
              <p><span className="font-medium">Type:</span> {bien.type}</p>
              <p><span className="font-medium">Adresse:</span> {bien.adresse}</p>
              <p><span className="font-medium">Ville:</span> {bien.ville}</p>
              <p><span className="font-medium">Code postal:</span> {bien.code_postal}</p>
              <p><span className="font-medium">Pays:</span> {bien.pays}</p>
            </div>
            <div>
              <h3 className="font-semibold">Caractéristiques</h3>
              <p><span className="font-medium">Nombre de pièces:</span> {bien.nombre_pieces}</p>
              <p><span className="font-medium">Surface:</span> {bien.surface} m²</p>
              <p><span className="font-medium">Loyer mensuel:</span> {bien.loyer_mensuel} €</p>
              <p><span className="font-medium">Description:</span> {bien.description}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Quitter le bien
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir quitter ce bien ?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 