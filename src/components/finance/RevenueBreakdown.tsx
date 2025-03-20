
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Calendar } from 'lucide-react';
import { mockPayments, mockProperties } from '@/utils/mockData';
import { PaymentStatus, PaymentType } from '@/utils/types';
import { format } from 'date-fns';

// Type pour les revenus par propriété
type PropertyRevenue = {
  propertyId: string;
  propertyName: string;
  amount: number;
  payments: {
    id: string;
    date: Date;
    amount: number;
  }[];
};

const RevenueBreakdown: React.FC = () => {
  // Récupère tous les paiements complétés de type loyer
  const completedRentPayments = mockPayments.filter(
    payment => payment.status === PaymentStatus.COMPLETED && payment.type === PaymentType.RENT
  );

  // Groupe les revenus par propriété
  const revenueByProperty: PropertyRevenue[] = completedRentPayments.reduce((acc, payment) => {
    const propertyIndex = acc.findIndex(item => item.propertyId === payment.propertyId);
    const property = mockProperties.find(p => p.id === payment.propertyId);
    const propertyName = property ? property.name : 'Bien inconnu';
    
    if (propertyIndex === -1) {
      acc.push({
        propertyId: payment.propertyId,
        propertyName,
        amount: payment.amount,
        payments: [{
          id: payment.id,
          date: payment.date,
          amount: payment.amount
        }]
      });
    } else {
      acc[propertyIndex].amount += payment.amount;
      acc[propertyIndex].payments.push({
        id: payment.id,
        date: payment.date,
        amount: payment.amount
      });
    }
    
    return acc;
  }, [] as PropertyRevenue[]);

  // Trie les propriétés par montant total (descendant)
  revenueByProperty.sort((a, b) => b.amount - a.amount);

  // Formatage de la date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer w-full h-full">Revenus totaux</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détail des revenus par bien</DialogTitle>
          <DialogDescription>
            Vue détaillée des revenus générés par chaque bien immobilier
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] mt-4">
          {revenueByProperty.map((property) => (
            <div key={property.propertyId} className="mb-6 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">{property.propertyName}</h3>
                <span className="ml-auto font-semibold">{property.amount.toLocaleString()} €</span>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.payments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => {
                      const fullPayment = mockPayments.find(p => p.id === payment.id);
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                            {formatDate(payment.date)}
                          </TableCell>
                          <TableCell>{fullPayment?.reference || '-'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {payment.amount.toLocaleString()} €
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueBreakdown;
