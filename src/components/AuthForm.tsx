import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthFormProps {
  onSuccess: (uid: string, role: string, bienId?: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState('proprietaire');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Vérifier si l'utilisateur existe dans PROPRIETAIRES
        const proprietaireDoc = await getDoc(doc(db, 'PROPRIETAIRES', user.uid));
        if (proprietaireDoc.exists()) {
          onSuccess(user.uid, 'proprietaire');
          return;
        }

        // Vérifier si l'utilisateur existe dans LOCATAIRES
        const locataireDoc = await getDoc(doc(db, 'LOCATAIRES', user.uid));
        if (locataireDoc.exists()) {
          const locataireData = locataireDoc.data();
          onSuccess(user.uid, 'locataire', locataireData.bienId);
          return;
        }

        throw new Error('Utilisateur non trouvé dans la base de données');
      } else {
        // Inscription
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (role === 'proprietaire') {
          // Créer le document propriétaire
          await setDoc(doc(db, 'PROPRIETAIRES', user.uid), {
            email,
            nom: nom,
            telephone: telephone,
            role: 'proprietaire',
            createdAt: serverTimestamp()
          });
          onSuccess(user.uid, 'proprietaire');
        } else {
          // Créer le document locataire
          await setDoc(doc(db, 'LOCATAIRES', user.uid), {
            email,
            nom: nom,
            telephone: telephone,
            role: 'locataire',
            createdAt: serverTimestamp()
          });
          onSuccess(user.uid, 'locataire');
        }
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bienvenue sur HabiTrack</CardTitle>
        <CardDescription>
          Connectez-vous ou créez un compte pour gérer vos biens immobiliers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === 'login')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type de compte</Label>
                <RadioGroup
                  value={role}
                  onValueChange={setRole}
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm; 