import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getBien } from '@/services/firebaseServices';
import MainLayout from '@/components/layout/MainLayout';
import PageTransition from '@/components/ui/PageTransition';
import { Link } from 'react-router-dom';
import MaLocation from '@/pages/locataire/MaLocation';

const Home = () => {
    const [bien, setBien] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBien();
    }, []);

    const loadBien = async () => {
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'locataire') {
                throw new Error('Vous devez être locataire pour accéder à cette page');
            }

            const bienData = await getBien(user.bienId);
            setBien(bienData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!bien) return <div>Bien non trouvé</div>;

    return (
        <MainLayout>
            <PageTransition>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="page-title">Bienvenue, {bien.locataireNom}</h1>
                    <p className="text-muted-foreground">Voici un aperçu de votre location.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations sur la propriété</CardTitle>
                                <CardDescription>{bien.adresse}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Type de bien : {bien.type}</p>
                                <p>Loyer mensuel : {bien.loyer_mensuel}€</p>
                                <p>Prochain paiement : 1 Mars 2024</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statut du bail</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Jours restants dans le bail : 30 jours</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions rapides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link to="/locataire/maintenance">
                                    <Button className="w-full">Gérer la maintenance</Button>
                                </Link>
                                <Link to="/locataire/finances">
                                    <Button className="w-full">Voir les finances</Button>
                                </Link>
                                <Link to="/locataire/documents">
                                    <Button className="w-full">Consulter les documents</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageTransition>
        </MainLayout>
    );
};

export default Home; 