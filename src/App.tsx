import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import { getCurrentUser, auth } from './services/firebaseServices';
import { User } from './types/types';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import AddProperty from "./pages/AddProperty";
import Tenants from "./pages/Tenants";
import AddPayment from "./pages/AddPayment";

const queryClient = new QueryClient();

function Navigation({ user }: { user: User }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="flex justify-between h-24 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="text-4xl font-bold text-gray-900">
            HabiTrack
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-xl text-gray-700 mr-8">
            {user.role === 'proprietaire' ? 'Propriétaire' : 'Locataire'}
          </span>
          <button
            onClick={async () => {
              try {
                await auth.signOut();
                console.log('Déconnexion réussie');
              } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
              }
            }}
            className="bg-red-600 text-white px-8 py-4 rounded-md hover:bg-red-700 text-xl font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Initialisation de l\'application...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('État d\'authentification changé:', firebaseUser ? 'Utilisateur connecté' : 'Non connecté');
      if (firebaseUser) {
        try {
          console.log('Récupération des données utilisateur...');
          const userData = await getCurrentUser();
          console.log('Données utilisateur reçues:', userData);
          setUser(userData);
          setError(null);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          setError('Erreur lors de la récupération des données utilisateur');
          setUser(null);
        }
      } else {
        console.log('Aucun utilisateur connecté');
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Nettoyage de l\'écouteur d\'authentification');
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} />
      <main className="p-8">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/add-payment" element={<AddPayment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
