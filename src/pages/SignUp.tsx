import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Bien } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'proprietaire' | 'locataire'>('proprietaire');
  const [loading, setLoading] = useState(false);
  const [biensVacants, setBiensVacants] = useState<Bien[]>([]);
  const [selectedBien, setSelectedBien] = useState<string>('');
  const [showBienDialog, setShowBienDialog] = useState(false);

  const getBiensVacants = async () => {
    try {
      const biensRef = collection(db, 'biens');
      const q = query(biensRef, where('statut', '==', 'vacant'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bien[];
    } catch (error) {
      console.error('Erreur lors de la récupération des biens vacants:', error);
      return [];
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Début de l\'inscription...');
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Utilisateur créé dans Auth:', user.uid);

      // Mettre à jour le profil avec le nom
      await updateProfile(user, { displayName: name });
      console.log('Profil mis à jour');

      // Si c'est un locataire, ouvrir la fenêtre de sélection du bien
      if (role === 'locataire') {
        console.log('Récupération des biens vacants...');
        const biens = await getBiensVacants();
        console.log('Biens vacants trouvés:', biens);
        setBiensVacants(biens);
        setShowBienDialog(true);
        return;
      }

      // Pour les propriétaires, créer directement le document
await setDoc(doc(db, role === 'proprietaire' ? 'proprietaires' : 'locataires', user.uid), {
        id: user.uid,
        email,
        nom: name,
        telephone: phone,
      });
      console.log('Document utilisateur créé');

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBienSelection = async () => {
    if (!selectedBien) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un bien",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non trouvé');

      // Créer le document utilisateur avec les informations du bien
      await setDoc(doc(db, 'locataires', user.uid), {
        uid: user.uid,
        email,
        nom: name,
        telephone: phone,
        role,
        bienId: selectedBien,
        createdAt: new Date().toISOString()
      });

      // Mettre à jour le statut du bien et ajouter l'ID du locataire
      const bienRef = doc(db, 'biens', selectedBien);
      await setDoc(bienRef, {
        statut: 'occupé',
        locataireId: user.uid
      }, { merge: true });

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      setShowBienDialog(false);
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nom complet"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Téléphone"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div>
            <Label>Type de compte</Label>
            <RadioGroup
              value={role}
              onValueChange={(value: 'proprietaire' | 'locataire') => setRole(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="proprietaire" id="proprietaire" />
                <Label htmlFor="proprietaire">Propriétaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="locataire" id="locataire" />
                <Label htmlFor="locataire">Locataire</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showBienDialog} onOpenChange={setShowBienDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionnez votre bien</DialogTitle>
            <DialogDescription>
              Choisissez le bien que vous occupez parmi les biens disponibles.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedBien} onValueChange={setSelectedBien}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un bien" />
              </SelectTrigger>
              <SelectContent>
                {biensVacants.map((bien) => (
                  <SelectItem key={bien.id} value={bien.id}>
                    {bien.nom} - {bien.adresse}, {bien.ville}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowBienDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleBienSelection}>
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp; 