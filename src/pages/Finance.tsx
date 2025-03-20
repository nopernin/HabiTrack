
import React, { useState, useRef } from 'react';
import { CreditCard, DollarSign, Filter, ArrowUpRight, ArrowDownRight, Calendar, PlusCircle, Search, LineChart } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  mockPayments, 
  mockProperties, 
  mockTenants,
  getTotalIncome
} from '@/utils/mockData';
import { Payment, PaymentStatus, PaymentType } from '@/utils/types';
import { motion } from 'framer-motion';
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import RevenueBreakdown from '@/components/finance/RevenueBreakdown';

const Finance = () => {
  const [payments] = useState(mockPayments);
  const [activeTab, setActiveTab] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Références pour le scroll
  const pendingPaymentsRef = useRef<HTMLDivElement>(null);
  const overduePaymentsRef = useRef<HTMLDivElement>(null);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : 'N/A';
  };

  // Get tenant name by ID
  const getTenantName = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'N/A';
  };

  // Filter payments based on active tab, property filter, and search query
  const filteredPayments = payments.filter(payment => {
    // Filter by tab (payment status)
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'completed' && payment.status === PaymentStatus.COMPLETED) ||
      (activeTab === 'pending' && payment.status === PaymentStatus.PENDING) ||
      (activeTab === 'overdue' && payment.status === PaymentStatus.OVERDUE);
    
    // Filter by property
    const matchesProperty = propertyFilter === 'all' || payment.propertyId === propertyFilter;
    
    // Filter by search query (reference or description)
    const matchesSearch = 
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTenantName(payment.tenantId).toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesProperty && matchesSearch;
  });

  // Get total amount for the filtered payments
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Income summary by month (for chart)
  const getIncomeByMonth = () => {
    const today = new Date();
    const months = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('fr-FR', { month: 'short' });
      
      // Calculate income for this month
      const income = payments
        .filter(payment => {
          const paymentDate = new Date(payment.date);
          return (
            payment.status === PaymentStatus.COMPLETED &&
            payment.type === PaymentType.RENT &&
            paymentDate.getMonth() === month.getMonth() &&
            paymentDate.getFullYear() === month.getFullYear()
          );
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      months.push({
        name: monthName,
        income: income
      });
    }
    
    return months;
  };

  const incomeByMonth = getIncomeByMonth();

  // Fonction pour gérer le clic sur les paiements en attente
  const handlePendingClick = () => {
    setActiveTab('pending');
    if (pendingPaymentsRef.current) {
      pendingPaymentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fonction pour gérer le clic sur les paiements en retard
  const handleOverdueClick = () => {
    setActiveTab('overdue');
    if (overduePaymentsRef.current) {
      overduePaymentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Finances</h1>
              <p className="text-muted-foreground">Suivi des loyers et gestion des paiements</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Enregistrer un paiement
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <RevenueBreakdown />
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalIncome().toLocaleString()} €</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handlePendingClick}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.filter(p => p.status === PaymentStatus.PENDING).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {payments.filter(p => p.status === PaymentStatus.PENDING)
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()} € à recevoir
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleOverdueClick}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements en retard</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.filter(p => p.status === PaymentStatus.OVERDUE).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {payments.filter(p => p.status === PaymentStatus.OVERDUE)
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()} € en retard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Income chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Évolution des revenus</CardTitle>
              <CardDescription>
                Revenus locatifs sur les 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={incomeByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value} €`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} €`, 'Revenus']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payments list */}
          <div className="space-y-4" ref={pendingPaymentsRef}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Paiements</h2>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              </Button>
            </div>

            {showFilters && (
              <motion.div 
                className="flex flex-col md:flex-row gap-4 bg-muted/10 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Référence ou description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Bien immobilier</label>
                  <Select 
                    value={propertyFilter} 
                    onValueChange={setPropertyFilter}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Tous les biens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les biens</SelectItem>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            <div ref={overduePaymentsRef}>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="completed">Payés</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="overdue">En retard</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="space-y-4">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Référence</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Bien</TableHead>
                            <TableHead>Locataire</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">
                                  {payment.reference || '-'}
                                </TableCell>
                                <TableCell className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                                  {formatDate(payment.date)}
                                </TableCell>
                                <TableCell>{getPropertyName(payment.propertyId)}</TableCell>
                                <TableCell>{getTenantName(payment.tenantId)}</TableCell>
                                <TableCell className="font-medium">
                                  {payment.amount.toLocaleString()} €
                                </TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.status === PaymentStatus.COMPLETED
                                      ? 'bg-green-100 text-green-800'
                                      : payment.status === PaymentStatus.PENDING
                                      ? 'bg-blue-100 text-blue-800'
                                      : payment.status === PaymentStatus.OVERDUE
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </TableCell>
                                <TableCell>{payment.type}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-10">
                                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-medium">Aucun paiement trouvé</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Modifiez vos filtres ou ajoutez un nouveau paiement.
                                </p>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <div className="flex justify-between items-center pt-2 px-2">
                    <div className="text-sm text-muted-foreground">
                      {filteredPayments.length} paiements • Total: {totalAmount.toLocaleString()} €
                    </div>
                    <Button variant="outline" size="sm">
                      <LineChart className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
};

export default Finance;
