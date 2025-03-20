
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser, UserRole } from '@/services/auth.service';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';

const baseFormSchema = z.object({
  role: z.enum(['proprietaire', 'locataire']),
  prenom: z.string().min(2, { message: "Le prénom est requis" }),
  nom: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const proprietaireFormSchema = baseFormSchema;

const locataireFormSchema = baseFormSchema.extend({
  proprietaireId: z.string().min(1, { message: "Sélectionnez un propriétaire" }),
  bienId: z.string().min(1, { message: "Sélectionnez un bien" })
});

type ProprietaireFormValues = z.infer<typeof proprietaireFormSchema>;
type LocataireFormValues = z.infer<typeof locataireFormSchema>;

type Proprietaire = {
  id: string;
  nom: string;
  prenom: string;
};

type Bien = {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
};

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('proprietaire');
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [selectedProprietaireId, setSelectedProprietaireId] = useState('');

  // Use the appropriate form schema based on the selected role
  const formSchema = role === 'proprietaire' ? proprietaireFormSchema : locataireFormSchema;
  
  const form = useForm<ProprietaireFormValues | LocataireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'proprietaire',
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Fetch proprietaires on component mount
  useEffect(() => {
    const fetchProprietaires = async () => {
      try {
        const proprietairesCollection = collection(db, 'proprietaires');
        const snapshot = await getDocs(proprietairesCollection);
        const proprietairesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Proprietaire[];
        
        setProprietaires(proprietairesData);
      } catch (error) {
        console.error("Error fetching proprietaires:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des propriétaires",
          variant: "destructive",
        });
      }
    };

    fetchProprietaires();
  }, [toast]);

  // Fetch properties when a proprietaire is selected
  useEffect(() => {
    const fetchBiens = async () => {
      if (!selectedProprietaireId) {
        setBiens([]);
        return;
      }

      try {
        const biensCollection = collection(db, 'biens');
        const snapshot = await getDocs(biensCollection);
        const biensData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(bien => bien.proprietaireId === selectedProprietaireId && bien.statut === 'Vacant')
          as Bien[];
        
        setBiens(biensData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des biens",
          variant: "destructive",
        });
      }
    };

    fetchBiens();
  }, [selectedProprietaireId, toast]);

  // Watch the role field to update the form schema
  const watchRole = form.watch('role');

  // Update the role state when the form role changes
  useEffect(() => {
    if (watchRole !== role) {
      setRole(watchRole as UserRole);
      form.reset({
        ...form.getValues(),
        role: watchRole
      });
    }
  }, [watchRole, form, role]);

  const onSubmit = async (data: ProprietaireFormValues | LocataireFormValues) => {
    setIsLoading(true);

    try {
      if (role === 'proprietaire') {
        // Register proprietaire
        const proprietaireData = data as ProprietaireFormValues;
        await registerUser(proprietaireData.email, proprietaireData.password, 'proprietaire', {
          nom: proprietaireData.nom,
          prenom: proprietaireData.prenom,
          telephone: proprietaireData.telephone
        });
      } else {
        // Register locataire
        const locataireData = data as LocataireFormValues;
        await registerUser(locataireData.email, locataireData.password, 'locataire', {
          nom: locataireData.nom,
          prenom: locataireData.prenom,
          telephone: locataireData.telephone,
          proprietaireId: locataireData.proprietaireId,
          bienId: locataireData.bienId
        });
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });

      navigate('/login');
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Cette adresse e-mail est déjà utilisée";
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proprietaire selection
  const handleProprietaireChange = (proprietaireId: string) => {
    setSelectedProprietaireId(proprietaireId);
    form.setValue('proprietaireId', proprietaireId);
    form.setValue('bienId', ''); // Reset bien selection
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen bg-background py-12">
        <div className="w-full max-w-lg px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-xl">RR</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold">Renter Ranger</h1>
              <p className="text-muted-foreground mt-2">Créez votre compte pour commencer</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                  Remplissez le formulaire pour créer votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Je suis</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="proprietaire" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Propriétaire
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="locataire" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Locataire
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse e-mail</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="exemple@email.com" 
                              type="email" 
                              autoComplete="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0612345678" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {role === 'locataire' && (
                      <>
                        <FormField
                          control={form.control}
                          name="proprietaireId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Propriétaire</FormLabel>
                              <Select
                                onValueChange={(value) => handleProprietaireChange(value)}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez votre propriétaire" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {proprietaires.map((proprietaire) => (
                                    <SelectItem key={proprietaire.id} value={proprietaire.id}>
                                      {proprietaire.prenom} {proprietaire.nom}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bienId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bien occupé</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedProprietaireId}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le bien que vous occupez" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {biens.length > 0 ? (
                                    biens.map((bien) => (
                                      <SelectItem key={bien.id} value={bien.id}>
                                        {bien.nom} - {bien.adresse}, {bien.ville}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-biens" disabled>
                                      Aucun bien disponible
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              autoComplete="new-password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              autoComplete="new-password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Déjà inscrit ? </span>
                  <Link to="/login" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
