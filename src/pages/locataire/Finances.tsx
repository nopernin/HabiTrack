import React, { useState, useEffect } from 'react';
import { Euro, CreditCard, History, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { getCurrentUser, getBien } from '@/services/firebaseServices';
import { Bien, Payment, PaymentStatus } from '@/types/types';

const Finances = () => {
  const [bien, setBien] = useState<Bien | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'locataire') {
        throw new Error('Vous devez être locataire pour accéder à cette page');
      }

      const bienData = await getBien(user.bienId);
      if (bienData) {
        setBien(bienData);
      }

      // TODO: Implémenter la récupération des paiements depuis Firestore
      // Pour l'instant, on utilise des données mockées
      const mockPayments: Payment[] = [
        {
          id: '1',
          bienId: user.bienId,
          locataireId: user.uid,
          montant: bienData?.loyer_mensuel || 0,
          date: new Date(),
          status: PaymentStatus.COMPLETED,
          type: 'Loyer',
          mois: 'Janvier 2024',
        },
        {
          id: '2',
          bienId: user.bienId,
          locataireId: user.uid,
          montant: bienData?.loyer_mensuel || 0,
          date: new Date(),
          status: PaymentStatus.PENDING,
          type: 'Loyer',
          mois: 'Février 2024',
        },
      ];

      setPayments(mockPayments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // TODO: Implémenter la logique de paiement
      console.log('Paiement en cours...');
      setShowPaymentModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'text-green-500';
      case PaymentStatus.PENDING:
        return 'text-yellow-500';
      case PaymentStatus.FAILED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case PaymentStatus.PENDING:
        return <AlertCircle className="h-4 w-4" />;
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bien) return <div>Bien non trouvé</div>;

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="page-title">Finances</h1>
            <p className="text-muted-foreground">Gestion de vos paiements et historique financier</p>
          </div>

          {/* En-tête avec statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <CardTitle className="text-sm font-medium">Prochain paiement</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1 Mars 2024</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut du paiement</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">En attente</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="mb-8">
            <Button onClick={() => setShowPaymentModal(true)} className="w-full md:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              Payer le loyer
            </Button>
          </div>

          {/* Historique des paiements */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>Consultez votre historique de paiements</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Mois</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell>{payment.mois}</TableCell>
                        <TableCell>{payment.montant}€</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{payment.status}</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Aucun paiement trouvé</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Vous n'avez pas encore effectué de paiement.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Modal de paiement */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Paiement du loyer</CardTitle>
                  <CardDescription>Effectuez votre paiement en ligne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Montant à payer</label>
                      <div className="text-2xl font-bold">{bien.loyer_mensuel}€</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mois</label>
                      <div className="text-lg">Mars 2024</div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handlePayment}>
                        Payer maintenant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Finances; 